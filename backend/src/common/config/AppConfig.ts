import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { DATABASE_TYPE } from 'src/enums/Database';
import { User, UserSchema } from 'src/users/entities/user.mongoose.entity';
import { UserEntity } from 'src/users/entities/user.mysql.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { SystemSettings, SystemSettingsSchema } from 'src/system-settings/entities/system-settings.schema';
import { SystemSettingsEntity } from 'src/system-settings/entities/system-settings.entity';

class EnvironmentVar {
    @IsNumber()
    public readonly PORT: number;

    @IsString()
    public readonly DB_TYPE: DATABASE_TYPE;

    @IsString()
    public readonly JWT_SECRET: string;

    @IsString()
    public readonly MONGO_URI: string;

    @IsString()
    public readonly MYSQL_HOST: string;

    @IsNumber()
    public readonly MYSQL_PORT: number;

    @IsString()
    public readonly MYSQL_USERNAME: string;

    @IsString()
    public readonly MYSQL_PASSWORD: string;

    @IsString()
    public readonly MYSQL_DATABASE: string;

    @IsString()
    public readonly MONGO_DATABASE: string;

    @IsString()
    public readonly NODE_ENV: string;

    @IsString()
    public readonly ADMIN_EMAIL: string;

    @IsString()
    public readonly ADMIN_PASSWORD: string;

    @IsString()
    public readonly FRONTEND_URL: string;
}

const loadAndValidateConfig = () => {
    const validatedConfig = plainToInstance(EnvironmentVar, process.env, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(
            `[Fatal Engine Crash] Environment Validation Failed:\n${errors.toString()}`,
        );
    }

    return Object.freeze({
        ...validatedConfig,
        PORT: Number(process.env.PORT) || 3000,
        MongoforRoot: MongooseModule.forRoot(validatedConfig.MONGO_URI, {
            dbName: validatedConfig.MONGO_DATABASE,
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            connectionFactory: (connection) => {
                if (validatedConfig.NODE_ENV !== 'production') {
                    console.log(`Connected to MongoDB: ${validatedConfig.MONGO_DATABASE}`);
                }
                return connection;
            },
        }),
        MysqlforRoot: TypeOrmModule.forRoot({
            type: 'mysql',
            host: validatedConfig.MYSQL_HOST! || 'localhost',
            port: Number(validatedConfig.MYSQL_PORT!) || 3306,
            username: validatedConfig.MYSQL_USERNAME! || 'root',
            password: validatedConfig.MYSQL_PASSWORD!,
            database: validatedConfig.MYSQL_DATABASE!,
            entities: [UserEntity, SystemSettingsEntity],
            synchronize: validatedConfig.NODE_ENV !== 'production',
        }),
        ThrottlerModule: ThrottlerModule.forRoot({
            throttlers: [{
                ttl: 900000,
                limit: 200,
            }]
        }),
        MonogoforFeature: MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: SystemSettings.name,
                schema: SystemSettingsSchema,
            }
        ]),
        MysqlforFeature: TypeOrmModule.forFeature([UserEntity, SystemSettingsEntity]),
        IS_MONGO: validatedConfig.DB_TYPE === 'mongodb',
        JwtModule: JwtModule.register({
            global: true,
            secret: validatedConfig.JWT_SECRET,
            signOptions: { expiresIn: '30d' },
        }),
    });
};

export const AppConfig = loadAndValidateConfig();
