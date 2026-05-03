import { Model } from 'mongoose';
import { PetDocument } from './schemas/pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
export declare class PetsService {
    private readonly petModel;
    constructor(petModel: Model<PetDocument>);
    private assertOwner;
    createForUser(userId: string, dto: CreatePetDto): Promise<PetDocument>;
    listForUser(userId: string): Promise<PetDocument[]>;
    findOneForUser(petId: string, userId: string): Promise<PetDocument>;
    updateForUser(petId: string, userId: string, dto: UpdatePetDto): Promise<PetDocument>;
    removeForUser(petId: string, userId: string): Promise<void>;
    findByIdInternal(petId: string): Promise<PetDocument | null>;
}
