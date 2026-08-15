import { AppConfig } from 'src/common/config/AppConfig';
import { UserRole } from 'src/enums/UserRole';
import { CreateSeedUserDto } from 'src/seeding/dto/create-seed-user.dto';

export const USERS: CreateSeedUserDto[] = [
    {
        username: UserRole.ADMIN,
        email: AppConfig.ADMIN_EMAIL,
        password: AppConfig.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        isDisabled: false,
        isBlacklisted: false,
    },
];
