import { UserRole } from "src/enums/UserRole";

export interface JwtUserPayLoad {
    id: string;
    role: UserRole.ADMIN | UserRole.USER;
    email: string;
    username: string;
    isDisabled: boolean;
    isBlacklisted: boolean;
}