import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/users/entities/user.mongoose.entity';

import { SeederRepository } from './SeederRepo';
import { CreateSeedUserDto } from '../dto/create-seed-user.dto';
import { SystemSettings } from 'src/system-settings/entities/system-settings.schema';

@Injectable()
export class MongooseSeederRepository implements SeederRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        @InjectModel(SystemSettings.name)
        private readonly systemSettingsModel: Model<SystemSettings>,
    ) {}

    async countUsers(): Promise<number> {
        return this.userModel.countDocuments();
    }

    async seedUsers(usersData: CreateSeedUserDto[]): Promise<void> {
        await this.userModel.create(usersData);
    }

    async countSystemSettings(): Promise<number> {
        return this.systemSettingsModel.countDocuments();
    }

    async seedSystemSettings(): Promise<void> {
        await this.systemSettingsModel.create({
            configName: 'global_config',
            isLoginEnabled: true,
            isSignupEnabled: true,
        });
    }
}