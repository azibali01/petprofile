import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PetDocument = HydratedDocument<Pet>;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: String, enum: ['cat', 'dog'], required: true })
  species!: 'cat' | 'dog';

  @Prop({ type: String, default: '' })
  breed!: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, enum: ['male', 'female'], required: true })
  gender!: 'male' | 'female';

  @Prop({ type: Number })
  weight?: number;

  @Prop({ type: String, default: '' })
  profilePhoto!: string;

  @Prop({ type: [String], default: [] })
  photos!: string[];

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['primary', 'secondary'], required: true },
      },
    ],
    default: [],
  })
  owners!: { userId: Types.ObjectId; role: 'primary' | 'secondary' }[];

  @Prop({
    type: {
      isNeutered: { type: Boolean, default: false },
      allergies: { type: [String], default: [] },
      conditions: { type: [String], default: [] },
      medications: { type: [String], default: [] },
      lastVetVisit: { type: Date },
      vetClinic: { type: String },
      vetPhone: { type: String },
      vaccines: {
        type: [
          {
            name: { type: String, required: true },
            date: { type: Date },
            nextDue: { type: Date, required: false, default: null },
          },
        ],
        default: [],
      },
    },
    default: {},
  })
  health!: {
    isNeutered: boolean;
    allergies: string[];
    conditions: string[];
    medications: string[];
    lastVetVisit?: Date;
    vetClinic?: string;
    vetPhone?: string;
    vaccines: { name: string; date?: Date; nextDue?: Date }[];
  };

  @Prop({
    type: {
      mealTimes: { type: [String], default: [] },
      walkSchedule: { type: String },
      traits: { type: [String], default: [] },
      trainingLevel: { type: String },
      knownCommands: { type: [String], default: [] },
      favouriteToys: { type: [String], default: [] },
    },
    default: {},
  })
  behaviour!: {
    mealTimes: string[];
    walkSchedule?: string;
    traits: string[];
    trainingLevel?: string;
    knownCommands: string[];
    favouriteToys: string[];
  };

  @Prop({
    type: {
      lastGroomingDate: { type: Date },
      frequencyWeeks: { type: Number },
      atHomeRoutine: { type: String },
    },
    default: {},
  })
  grooming!: {
    lastGroomingDate?: Date;
    frequencyWeeks?: number;
    atHomeRoutine?: string;
  };

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
