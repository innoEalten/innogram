import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.schema';

@Schema()
export class User {
  @Prop({ type: RefreshTokenSchema })
  refreshToken: RefreshToken;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocumentOverride = {
  refreshToken: Types.Subdocument<Types.ObjectId> & RefreshToken;
};

export type UserDocument = HydratedDocument<User>;
