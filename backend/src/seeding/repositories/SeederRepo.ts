import { CreateSeedUserDto } from '../dto/create-seed-user.dto';
export abstract class SeederRepository {
    abstract countUsers(): Promise<number>;
    abstract seedUsers(usersData: CreateSeedUserDto[]): Promise<void>;
    abstract countSystemSettings(): Promise<number>;
    abstract seedSystemSettings(): Promise<void>;
}
