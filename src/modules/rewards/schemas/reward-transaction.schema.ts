import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RewardTransactionDocument = HydratedDocument<RewardTransaction>;

@Schema({ timestamps: true })
export class RewardTransaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amountCents!: number;

  @Prop({ type: Types.ObjectId, ref: 'Log' })
  logId?: Types.ObjectId;

  @Prop({ type: String, enum: ['award', 'redeem'], required: true })
  type!: 'award' | 'redeem';
}

export const RewardTransactionSchema =
  SchemaFactory.createForClass(RewardTransaction);
