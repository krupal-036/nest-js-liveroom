// backend/src/seeding/seeder.module.ts
import { Module } from "@nestjs/common";
import { AppConfig } from "@/common/config/AppConfig";
import { SeederService } from "@/seeding/seeder.service";
import { SeederRepository } from "@/seeding/repositories/SeederRepo";
import { MysqlSeederRepository } from "@/seeding/repositories/mysql-seeder.repo";
import { MongooseSeederRepository } from "@/seeding/repositories/mongoose-seeder.repo";

@Module({
    imports: [...(AppConfig.IS_MONGO ? [AppConfig.MongoforFeature] : [AppConfig.MysqlforFeature])],
    providers: [
        SeederService,
        {
            provide: SeederRepository,
            useClass: AppConfig.IS_MONGO ? MongooseSeederRepository : MysqlSeederRepository,
        },
    ],
})
export class SeederModule {}
