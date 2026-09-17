// backend/src/types/types.ts
import { UserRole } from "@/enums/UserRole";

export interface JwtUserPayLoad {
    id: string;
    role: UserRole.ADMIN | UserRole.USER;
    email: string;
    username: string;
    isDisabled: boolean;
    isBlacklisted: boolean;
}
