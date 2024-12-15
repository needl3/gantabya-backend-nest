import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User)
