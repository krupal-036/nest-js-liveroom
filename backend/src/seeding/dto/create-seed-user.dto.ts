// backend/src/seeding/dto/create-seed-user.dto.ts
import { UserRole } from "@/enums/UserRole";

export class CreateSeedUserDto {
    username: UserRole | string;
    email: string;
    password: string;
    role: UserRole;
    isDisabled: boolean;
    isBlacklisted: boolean;
}
