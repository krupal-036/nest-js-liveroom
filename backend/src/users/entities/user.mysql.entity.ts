import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm';
import { hashPassword } from 'src/utils/passwordUtils';
import { Types } from 'mongoose';

@Entity('users')
export class UserEntity {
    @PrimaryColumn({ type: 'varchar', length: 24 })
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ default: false })
    isDisabled: boolean;

    @Column({ default: false })
    isBlacklisted: boolean;

    @Column({ type: 'varchar', nullable: true })
    currentRoom: string | null;

    @BeforeInsert()
    async handleBeforeInsert() {
        if (!this.id) {
            this.id = new Types.ObjectId().toString();
        }

        if (this.password) {
            this.password = await hashPassword(this.password);
        }
    }

    @BeforeUpdate()
    async handleBeforeUpdate() {
        if (this.password) {
            this.password = await hashPassword(this.password);
        }
    }
}
