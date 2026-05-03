import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(userId: string, dto: CreatePetDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pet.schema").Pet, {}, {}> & import("./schemas/pet.schema").Pet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/pet.schema").Pet, {}, {}> & import("./schemas/pet.schema").Pet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pet.schema").Pet, {}, {}> & import("./schemas/pet.schema").Pet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, userId: string, dto: UpdatePetDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pet.schema").Pet, {}, {}> & import("./schemas/pet.schema").Pet & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(id: string, userId: string): Promise<void>;
}
