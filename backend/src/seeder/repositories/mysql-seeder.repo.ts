import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.mysql.entity';
import { SeederRepository } from './SeederRepo';
import { CreateSeedUserDto } from '../dto/create-seed-user.dto';

@Injectable()
export class MysqlSeederRepository implements SeederRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async countUsers(): Promise<number> {
        return this.userRepo.count();
    }

    async seedUsers(usersData: CreateSeedUserDto[]): Promise<void> {
        const users = this.userRepo.create(usersData);
        await this.userRepo.save(users);
    }
}
