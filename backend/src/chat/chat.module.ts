// backend/src/chat/chat.module.ts
import { Module } from "@nestjs/common";
import { ChatGateway } from "@/chat/chat.gateway";
import { AppConfig } from "@/common/config/AppConfig";
import { MysqlUserRepo } from "@/users/repositories/MysqlUserRepo";
import { UserRepository } from "@/users/repositories/UserRepository";
import { MongooseUserRepo } from "@/users/repositories/MongooseUserRepo";

@Module({
    imports: [
        AppConfig.IS_MONGO ? AppConfig.MongoforFeature : AppConfig.MysqlforFeature,
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
