import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Model, Types } from 'mongoose';
import { PetsService } from '../pets/pets.service';
import {
  PetDocumentFile,
  PetDocumentFileDocument,
} from './schemas/pet-document.schema';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly petsService: PetsService,
    @InjectModel(PetDocumentFile.name)
    private readonly docModel: Model<PetDocumentFileDocument>,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async upload(
    userId: string,
    petId: string,
    file: Express.Multer.File,
  ): Promise<PetDocumentFileDocument> {
    await this.petsService.findOneForUser(petId, userId);
    const folder = `pet-profile/documents/${userId}`;
    const uploaded = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'auto' },
          (err, result) => {
            if (err || !result) {
              reject(err ?? new Error('Upload failed'));
            } else {
              resolve(result);
            }
          },
        );
        stream.end(file.buffer);
      },
    );

    return this.docModel.create({
      userId: new Types.ObjectId(userId),
      petId: new Types.ObjectId(petId),
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  async listByPet(petId: string, userId: string): Promise<PetDocumentFileDocument[]> {
    await this.petsService.findOneForUser(petId, userId);
    return this.docModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(userId: string, docId: string): Promise<void> {
    const doc = await this.docModel.findById(new Types.ObjectId(docId)).exec();
    if (!doc || doc.userId.toString() !== userId) {
      throw new NotFoundException('Document not found');
    }
    await cloudinary.uploader.destroy(doc.publicId);
    await doc.deleteOne();
  }
}
