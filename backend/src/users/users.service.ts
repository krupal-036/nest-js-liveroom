import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/passwordUtils';
import { UserRepository } from './repositories/UserRepository';
import { UserRole } from 'src/enums/UserRole';
import { JwtUserPayLoad } from 'src/types/types';
import { SystemSettingsService } from 'src/system-settings/system-settings.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepo: UserRepository,
        private readonly jwtService: JwtService,
        private readonly systemSettingsService: SystemSettingsService,
    ) { }

    async login(body: UpdateUserDto) {
        const user = await this.usersRepo.findByFilter({ email: body.email }, true);
        if (!user) throw new NotFoundException({ message: 'User not found' });
        if (user.isBlacklisted) throw new ForbiddenException('This email is blacklisted.');
        if (user.isDisabled)
            throw new ForbiddenException('This account has been disabled by an admin.');

        if (!(await comparePassword(body.password!, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        if (user.role !== UserRole.ADMIN) {
            const isLoginEnabled =
                await this.systemSettingsService.isLoginEnabled();

            if (!isLoginEnabled) {
                throw new ForbiddenException(
                    'Login is currently disabled by the administrator.',
                );
            }
        }

        const payload: JwtUserPayLoad = {
            id: user.id,
            role: user.role,
            email: user.email,
            username: user.username,
            isDisabled: user.isDisabled,
            isBlacklisted: user.isBlacklisted,
        };

        return { token: this.jwtService.sign(payload), payload };
    }

    async logout(token: string) {
        const decoded: JwtUserPayLoad = await this.jwtService.verifyAsync(token);
        this.usersRepo.updateStatus(decoded.id, { currentRoom: null });
    }

    async create(createUserDto: CreateUserDto) {
        const isSignupEnabled = await this.systemSettingsService.isSignupEnabled();

        if (!isSignupEnabled) {
            throw new ForbiddenException('Signup is currently disabled by the administrator.');
        }

        if (createUserDto.role === UserRole.ADMIN || createUserDto.username === UserRole.ADMIN) {
            throw new BadRequestException(
                'Admin account creation is disabled. All admin accounts have already been seeded.',
            );
        }
        const existingUser = await this.usersRepo.findByEmail(createUserDto.email);
        if (existingUser) {
            if (existingUser.isBlacklisted)
                throw new ForbiddenException('This email is blacklisted.');
            throw new ConflictException({ message: 'User with this email already exists' });
        }
        const user = await this.usersRepo.create(createUserDto);
        delete user.password;
        return user;
    }

    async findAll() {
        return this.usersRepo.findAll();
    }

    async verifyMe(payload: JwtUserPayLoad) {
        const user = await this.findOne(payload.id);
        if (user.email.toLowerCase() !== payload.email.toLowerCase()) {
            throw new ForbiddenException({ message: 'You are not allowed to access this routes.' });
        }
        return { message: true };
    }

    async findOne(id: string) {
        const user = await this.usersRepo.findByFilter({ id });
        if (!user) {
            throw new NotFoundException({
                message: `User with ID : ${id} not found`,
            });
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepo.findByFilter({ id });
        if (!user) {
            throw new NotFoundException({
                message: `User with ID : ${id} not found`,
            });
        }
        return this.usersRepo.update(id, updateUserDto);
    }

    async remove(id: string) {
        const user = await this.usersRepo.findByFilter({ id });
        if (!user) {
            throw new NotFoundException({
                message: `User with ID : ${id} not found`,
            });
        }
        const deletedCount = await this.usersRepo.delete(id);
        return {
            success: true,
            message: `User with ID : ${id} deleted succesfully`,
            deletedCount,
        };
    }

    async disableUser(id: string, isDisabled: boolean) {
        return this.usersRepo.updateStatus(id, { isDisabled });
    }

    async blacklistUser(id: string, isBlacklisted: boolean) {
        this.usersRepo.updateStatus(id, { currentRoom: null });
        return this.usersRepo.updateStatus(id, { isBlacklisted });
    }

    async updateUserRoom(id: string, room: string | null) {
        return this.usersRepo.updateStatus(id, { currentRoom: room || null });
    }
}
