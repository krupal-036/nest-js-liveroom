import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfig } from 'src/common/config/AppConfig';
import { SeederRepository } from './repositories/SeederRepo';
import { USERS } from 'src/utils/usersData';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    constructor(private readonly seederRepo: SeederRepository) {}

    async onApplicationBootstrap() {
        const dbName = AppConfig.IS_MONGO ? 'MongoDB' : 'MySQL';

        const count = await this.seederRepo.countUsers();
        if (count > 0) {
            console.log(`[${dbName}] All Users Already seeded`);
            return;
        }

        await this.seederRepo.seedUsers(USERS);
        console.log(`[${dbName}] Users Seeded Successfully`);
    }
}
