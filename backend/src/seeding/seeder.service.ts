import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { AppConfig } from 'src/common/config/AppConfig';
import { USERS } from 'src/utils/usersData';

import { SeederRepository } from './repositories/SeederRepo';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    constructor(
        private readonly seederRepo: SeederRepository,
    ) {}

    async onApplicationBootstrap() {
        const dbName = AppConfig.IS_MONGO ? 'MongoDB' : 'MySQL';

        await this.seedUsers(dbName);
        await this.seedSystemSettings(dbName);
    }

    private async seedUsers(dbName: string): Promise<void> {
        const count = await this.seederRepo.countUsers();

        if (count > 0) {
            console.log(`[${dbName}] Users already seeded`);
            return;
        }

        await this.seederRepo.seedUsers(USERS);

        console.log(`[${dbName}] Users seeded successfully`);
    }

    private async seedSystemSettings(dbName: string): Promise<void> {
        const count = await this.seederRepo.countSystemSettings();

        if (count > 0) {
            console.log(`[${dbName}] System Settings already seeded`);
            return;
        }

        await this.seederRepo.seedSystemSettings();

        console.log(`[${dbName}] System Settings seeded successfully`);
    }
}