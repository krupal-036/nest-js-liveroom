import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.mongoose.entity';
import { SeederRepository } from './SeederRepo';
import { CreateSeedUserDto } from '../dto/create-seed-user.dto';

@Injectable()
export class MongooseSeederRepository implements SeederRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async countUsers(): Promise<number> {
        return this.userModel.countDocuments();
    }

    async seedUsers(usersData: CreateSeedUserDto[]): Promise<void> {
        await this.userModel.create(usersData);
    }
}
