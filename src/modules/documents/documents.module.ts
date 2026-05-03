import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PetDocumentFile,
  PetDocumentFileSchema,
} from './schemas/pet-document.schema';
import { PetsModule } from '../pets/pets.module';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [
    PetsModule,
    MongooseModule.forFeature([
      { name: PetDocumentFile.name, schema: PetDocumentFileSchema },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
