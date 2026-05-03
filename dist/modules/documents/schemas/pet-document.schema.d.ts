import { HydratedDocument, Types } from 'mongoose';
export type PetDocumentFileDocument = HydratedDocument<PetDocumentFile>;
export declare class PetDocumentFile {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    url: string;
    publicId: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
}
export declare const PetDocumentFileSchema: import("mongoose").Schema<PetDocumentFile, import("mongoose").Model<PetDocumentFile, any, any, any, import("mongoose").Document<unknown, any, PetDocumentFile, any, {}> & PetDocumentFile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PetDocumentFile, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<PetDocumentFile>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<PetDocumentFile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
