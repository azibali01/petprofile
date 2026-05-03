import { HydratedDocument, Types } from 'mongoose';
export type LogDocument = HydratedDocument<Log>;
export declare class Log {
    petId: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'meal' | 'walk' | 'mood' | 'behaviour' | 'symptom' | 'medication' | 'vet_visit' | 'grooming' | 'expense' | 'weight' | 'training';
    data: Record<string, unknown>;
    isValidated: boolean;
    pointsAwarded: number;
    voiceTranscript?: string;
    attachments: string[];
    loggedAt: Date;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, import("mongoose").Document<unknown, any, Log, any, {}> & Log & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Log>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Log> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
