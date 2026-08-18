import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, QueryFilter } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.mongoose.entity';
import { UserRepository } from './UserRepository';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class MongooseUserRepo implements UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    private toTransformId(value: any | any[]): any | any[] {
        const transform = (doc: any) => {
            if (!doc) return null;
            const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
            const { _id, __v, createdAt, updatedAt, password, ...rest } = obj;
            return {
                id: _id?.toString() || obj.id,
                ...rest,
                ...(password && { password }),
            };
        };

        return Array.isArray(value) ? value.map(transform) : transform(value);
    }

    async create(createUserDto: CreateUserDto): Promise<any> {
        const user = await this.userModel.create(createUserDto);
        return this.toTransformId(user);
    }

    async findAll(): Promise<any[]> {
        const users = await this.userModel.find().select('-password').lean().exec();
        return this.toTransformId(users);
    }

    async findByFilter(filter: QueryFilter<User>, includePassword = false): Promise<User | null> {
        if (filter.id) {
            filter._id = filter.id;
            delete filter.id;
        }
        const query = this.userModel.findOne(filter).lean();

        if (!includePassword) {
            query.select('-password');
        }

        const user = await query.exec();
        return this.toTransformId(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = (await this.userModel.findOne({ _id: id })) as User;
        user.username = updateUserDto.username || user.username;
        user.email = updateUserDto.email || user.email;
        if (updateUserDto.password) {
            user.password = updateUserDto.password;
        }
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        return this.toTransformId(userObj);
    }

    async findByEmail(email: string): Promise<any | null> {
        const user = await this.userModel.findOne({ email }).lean().exec();
        return this.toTransformId(user);
    }

    async updateStatus(
        id: string,
        status: { isDisabled?: boolean; isBlacklisted?: boolean; currentRoom?: string | null },
    ): Promise<any> {
        const updated = await this.userModel
            .findByIdAndUpdate(id, status, { returnDocument: 'after' })
            .select('-password')
            .lean()
            .exec();
        return this.toTransformId(updated);
    }

    async delete(id: string): Promise<number> {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        return result.deletedCount;
    }
}
