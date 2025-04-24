import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class RefreshToken {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop()
  createdAt?: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
