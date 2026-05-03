import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    upload(userId: string, petId: string, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pet-document.schema").PetDocumentFile, {}, {}> & import("./schemas/pet-document.schema").PetDocumentFile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    list(petId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/pet-document.schema").PetDocumentFile, {}, {}> & import("./schemas/pet-document.schema").PetDocumentFile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    remove(id: string, userId: string): Promise<void>;
}
