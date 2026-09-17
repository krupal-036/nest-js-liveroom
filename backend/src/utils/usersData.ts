// backend/src/utils/usersData.ts
import { AppConfig } from "@/common/config/AppConfig";
import { UserRole } from "@/enums/UserRole";
import { CreateSeedUserDto } from "@/seeding/dto/create-seed-user.dto";

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
