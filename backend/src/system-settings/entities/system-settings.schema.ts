import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SystemSettingsDocument = HydratedDocument<SystemSettings>;

@Schema({ timestamps: false })
export class SystemSettings {
    @Prop({
        type: String, default: 'global_config', unique: true, required: true,
    })
    configName: string;

    @Prop({
        type: Boolean, default: true,
    })
    isLoginEnabled: boolean;

    @Prop({
        type: Boolean, default: true,
    })
    isSignupEnabled: boolean;

    @Prop({
        type: Date, default: Date.now,
    })
    createdAt: Date;
}

export const SystemSettingsSchema = SchemaFactory.createForClass(SystemSettings);