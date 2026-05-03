import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Log {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: [
      'meal',
      'walk',
      'mood',
      'behaviour',
      'symptom',
      'medication',
      'vet_visit',
      'grooming',
      'expense',
      'weight',
      'training',
    ],
    required: true,
  })
  type!:
    | 'meal'
    | 'walk'
    | 'mood'
    | 'behaviour'
    | 'symptom'
    | 'medication'
    | 'vet_visit'
    | 'grooming'
    | 'expense'
    | 'weight'
    | 'training';

  @Prop({ type: Object, required: true })
  data!: Record<string, unknown>;

  @Prop({ type: Boolean, default: false })
  isValidated!: boolean;

  @Prop({ type: Number, default: 0 })
  pointsAwarded!: number;

  @Prop({ type: String })
  voiceTranscript?: string;

  @Prop({ type: [String], default: [] })
  attachments!: string[];

  @Prop({ type: Date, required: true, default: () => new Date() })
  loggedAt!: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
