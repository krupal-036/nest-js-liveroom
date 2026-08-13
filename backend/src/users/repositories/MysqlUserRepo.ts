import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.mysql.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class MysqlUserRepo implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async create(createUserDto: CreateUserDto | CreateUserDto[]): Promise<any> {
        const users = this.userRepo.create(createUserDto as any);
        return this.userRepo.save(users);
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepo.find({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isDisabled: true,
                isBlacklisted: true,
                currentRoom: true,
            },
        });
    }

    async findByFilter(filter: Record<string, any>, includePassword = false): Promise<any | null> {
        const query: any = {
            where: filter,
        };
        if (!includePassword) {
            query.select = {
                id: true,
                username: true,
                email: true,
                role: true,
                isDisabled: true,
                isBlacklisted: true,
                currentRoom: true,
            };
        }
        return this.userRepo.findOne(query);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException({ message: 'User Not found' });
        }
        if (updateUserDto.username) user.username = updateUserDto.username;
        if (updateUserDto.email) user.email = updateUserDto.email;
        if (updateUserDto.role) user.role = updateUserDto.role;
        if (updateUserDto.password) user.password = updateUserDto.password;

        await this.userRepo.save(user);
        return await this.findByFilter({ id });
    }

    async findByEmail(email: string): Promise<any | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    async updateStatus(
        id: string,
        status: { isDisabled?: boolean; isBlacklisted?: boolean; currentRoom?: string | null },
    ): Promise<any> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException({ message: 'User Not found' });
        }

        if (status.isBlacklisted !== undefined) {
            user.isBlacklisted = status.isBlacklisted;
        }
        if (status.isDisabled !== undefined) {
            user.isDisabled = status.isDisabled;
        }
        if (status.currentRoom !== undefined) {
            user.currentRoom = status.currentRoom;
        }

        await this.userRepo.save(user);
        return await this.findByFilter({ id });
    }

    async delete(id: string): Promise<number> {
        const result = await this.userRepo.delete({ id });
        return result.affected || 0;
    }
}
