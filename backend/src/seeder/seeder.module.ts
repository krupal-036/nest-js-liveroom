import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AppConfig } from 'src/common/config/AppConfig';
import { SeederRepository } from './repositories/SeederRepo';
import { MongooseSeederRepository } from './repositories/mongoose-seeder.repo';
import { MysqlSeederRepository } from './repositories/mysql-seeder.repo';

@Module({
    imports: [...(AppConfig.IS_MONGO ? [AppConfig.MonogoforFeature] : [AppConfig.MysqlforFeature])],
    providers: [
        SeederService,
        {
            provide: SeederRepository,
            useClass: AppConfig.IS_MONGO ? MongooseSeederRepository : MysqlSeederRepository,
        },
    ],
})
export class SeederModule {}
