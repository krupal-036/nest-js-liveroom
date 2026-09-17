// backend/src/seeding/repositories/mysql-seeder.repo.ts
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/users/entities/user.mysql.entity";
import { SeederRepository } from "@/seeding/repositories/SeederRepo";
import { CreateSeedUserDto } from "@/seeding/dto/create-seed-user.dto";
import { SystemSettingsEntity } from "@/system-settings/entities/system-settings.entity";

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
            configName: "global_config",
            isLoginEnabled: true,
            isSignupEnabled: true,
        });

        await this.systemSettingsRepo.save(settings);
    }
}
