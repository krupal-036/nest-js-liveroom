// backend/src/seeding/repositories/SeederRepo.ts
import { CreateSeedUserDto } from "@/seeding/dto/create-seed-user.dto";
export abstract class SeederRepository {
    abstract countUsers(): Promise<number>;
    abstract seedUsers(usersData: CreateSeedUserDto[]): Promise<void>;
    abstract countSystemSettings(): Promise<number>;
    abstract seedSystemSettings(): Promise<void>;
}
