import { UserRole } from 'src/enums/UserRole';

export class CreateSeedUserDto {
    username: UserRole | string;
    email: string;
    password: string;
    role: UserRole;
    isDisabled: boolean;
    isBlacklisted: boolean;
}
