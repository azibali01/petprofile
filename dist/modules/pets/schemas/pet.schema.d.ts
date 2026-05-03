import { HydratedDocument, Types } from 'mongoose';
export type PetDocument = HydratedDocument<Pet>;
export declare class Pet {
    name: string;
    species: 'cat' | 'dog';
    breed: string;
    dateOfBirth?: Date;
    gender: 'male' | 'female';
    weight?: number;
    profilePhoto: string;
    photos: string[];
    owners: {
        userId: Types.ObjectId;
        role: 'primary' | 'secondary';
    }[];
    health: {
        isNeutered: boolean;
        allergies: string[];
        conditions: string[];
        medications: string[];
        lastVetVisit?: Date;
        vetClinic?: string;
        vetPhone?: string;
        vaccines: {
            name: string;
            date?: Date;
            nextDue?: Date;
        }[];
    };
    behaviour: {
        mealTimes: string[];
        walkSchedule?: string;
        traits: string[];
        trainingLevel?: string;
        knownCommands: string[];
        favouriteToys: string[];
    };
    grooming: {
        lastGroomingDate?: Date;
        frequencyWeeks?: number;
        atHomeRoutine?: string;
    };
    isActive: boolean;
}
export declare const PetSchema: import("mongoose").Schema<Pet, import("mongoose").Model<Pet, any, any, any, import("mongoose").Document<unknown, any, Pet, any, {}> & Pet & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pet, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Pet>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Pet> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
