import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ type: String, default: '' })
  profilePhoto!: string;

  @Prop({ type: String, enum: ['primary', 'secondary'], default: 'primary' })
  role!: 'primary' | 'secondary';

  @Prop({
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  })
  subscriptionPlan!: 'free' | 'basic' | 'premium';

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'trial'],
    default: 'active',
  })
  subscriptionStatus!: 'active' | 'inactive' | 'trial';

  @Prop({ type: Date })
  trialEndsAt?: Date;

  @Prop({ type: Number, default: 0 })
  rewardPoints!: number;

  @Prop({ type: Number, default: 0 })
  streakCount!: number;

  @Prop({ type: Date })
  lastLogDate?: Date;

  @Prop({ type: String, unique: true, sparse: true })
  referralCode!: string;

  @Prop({ type: String })
  referredBy?: string;

  @Prop({ type: String })
  pushToken?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified!: boolean;

  @Prop({ type: String })
  passwordResetToken?: string;

  @Prop({ type: Date })
  passwordResetExpires?: Date;

  @Prop({
    type: {
      emailDaily: { type: Boolean, default: true },
      pushReEngagement: { type: Boolean, default: true },
      pushVaccine: { type: Boolean, default: true },
      pushGrooming: { type: Boolean, default: true },
      pushWeeklySummary: { type: Boolean, default: true },
    },
    default: {},
  })
  notificationPreferences!: {
    emailDaily: boolean;
    pushReEngagement: boolean;
    pushVaccine: boolean;
    pushGrooming: boolean;
    pushWeeklySummary: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = uuidv4();
  }
  next();
});
