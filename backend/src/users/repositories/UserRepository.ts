import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UserRepository {
    abstract create(createUserDto: CreateUserDto): Promise<any>;
    abstract findAll(): Promise<any[]>;
    abstract findByFilter(filter: Record<any, any>, includePassword?: boolean): Promise<any | null>;
    abstract findByEmail(email: string): Promise<any | null>;
    abstract update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    abstract updateStatus(
        id: string,
        status: { isDisabled?: boolean; isBlacklisted?: boolean; currentRoom?: string | null },
    ): Promise<any>;
    abstract delete(id: string): Promise<number>;
}
