import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { PetsService } from '../pets/pets.service';
import { PetDocumentFileDocument } from './schemas/pet-document.schema';
export declare class DocumentsService {
    private readonly configService;
    private readonly petsService;
    private readonly docModel;
    constructor(configService: ConfigService, petsService: PetsService, docModel: Model<PetDocumentFileDocument>);
    upload(userId: string, petId: string, file: Express.Multer.File): Promise<PetDocumentFileDocument>;
    listByPet(petId: string, userId: string): Promise<PetDocumentFileDocument[]>;
    delete(userId: string, docId: string): Promise<void>;
}
