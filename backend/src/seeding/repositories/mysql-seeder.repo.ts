import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/users/entities/user.mysql.entity';

import { SeederRepository } from './SeederRepo';
import { CreateSeedUserDto } from '../dto/create-seed-user.dto';
import { SystemSettingsEntity } from 'src/system-settings/entities/system-settings.entity';

@Injectable()
export class MysqlSeederRepository implements SeederRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,

        @InjectRepository(SystemSettingsEntity)
        private readonly systemSettingsRepo: Repository<SystemSettingsEntity>,
    ) {}

    async countUsers(): Promise<number> {
        return this.userRepo.count();
    }

    async seedUsers(usersData: CreateSeedUserDto[]): Promise<void> {
        const users = this.userRepo.create(usersData);
        await this.userRepo.save(users);
    }

    async countSystemSettings(): Promise<number> {
        return this.systemSettingsRepo.count();
    }

    async seedSystemSettings(): Promise<void> {
        const settings = this.systemSettingsRepo.create({
            configName: 'global_config',
            isLoginEnabled: true,
            isSignupEnabled: true,
        });

        await this.systemSettingsRepo.save(settings);
    }
}