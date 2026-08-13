import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashPassword } from 'src/utils/passwordUtils';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    username: string;

    @Prop({ type: String })
    password: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop({ type: Boolean, default: false })
    isDisabled: boolean;

    @Prop({ type: Boolean, default: false })
    isBlacklisted: boolean;

    @Prop()
    currentRoom: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
});
