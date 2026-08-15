import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { Types } from 'mongoose';

@Entity('system_settings')
export class SystemSettingsEntity {
    @PrimaryColumn({ type: 'varchar', length: 24 })
    id: string;

    @Column({
        unique: true,
        default: 'global_config',
    })
    configName: string;

    @Column({ default: true })
    isLoginEnabled: boolean;

    @Column({ default: true })
    isSignupEnabled: boolean;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @BeforeInsert()
    handleBeforeInsert() {
        if (!this.id) {
            this.id = new Types.ObjectId().toString();
        }
    }
}