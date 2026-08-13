import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserRepository } from 'src/users/repositories/UserRepository';
import { AppConfig } from 'src/common/config/AppConfig';
import { MongooseUserRepo } from 'src/users/repositories/MongooseUserRepo';
import { MysqlUserRepo } from 'src/users/repositories/MysqlUserRepo';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        AppConfig.IS_MONGO ? AppConfig.MonogoforFeature : AppConfig.MysqlforFeature,
        AppConfig.JwtModule,
    ],
    providers: [
        ChatGateway,
        {
            provide: UserRepository,
            useClass: AppConfig.IS_MONGO ? MongooseUserRepo : MysqlUserRepo,
        },
    ],
})
export class ChatModule {}
