import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PetDocumentFileDocument = HydratedDocument<PetDocumentFile>;

@Schema({ timestamps: true, collection: 'pet_documents' })
export class PetDocumentFile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  url!: string;

  @Prop({ type: String, required: true })
  publicId!: string;

  @Prop({ type: String })
  originalName?: string;

  @Prop({ type: String })
  mimeType?: string;

  @Prop({ type: Number })
  size?: number;
}

export const PetDocumentFileSchema =
  SchemaFactory.createForClass(PetDocumentFile);
