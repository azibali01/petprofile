import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from './schemas/pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private readonly petModel: Model<PetDocument>) {}

  private assertOwner(pet: PetDocument, userId: string) {
    const owners = pet.owners ?? [];
    const ok = owners.some(
      (o) => o.userId.toString() === userId || String(o.userId) === userId,
    );
    if (!ok) {
      throw new ForbiddenException('Not an owner of this pet');
    }
  }

  async createForUser(userId: string, dto: CreatePetDto): Promise<PetDocument> {
    const owners =
      dto.owners?.map((o) => ({
        userId: new Types.ObjectId(o.userId),
        role: o.role,
      })) ?? [{ userId: new Types.ObjectId(userId), role: 'primary' as const }];

    const pet = new this.petModel({
      ...dto,
      owners,
      photos: dto.photos ?? [],
      health: dto.health ?? {},
      behaviour: dto.behaviour ?? {},
      grooming: dto.grooming ?? {},
    });
    return pet.save();
  }

  async listForUser(userId: string): Promise<PetDocument[]> {
    return this.petModel
      .find({ 'owners.userId': new Types.ObjectId(userId), isActive: true })
      .exec();
  }

  async findOneForUser(petId: string, userId: string): Promise<PetDocument> {
    const pet = await this.petModel.findById(new Types.ObjectId(petId)).exec();
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    this.assertOwner(pet, userId);
    return pet;
  }

  async updateForUser(
    petId: string,
    userId: string,
    dto: UpdatePetDto,
  ): Promise<PetDocument> {
    await this.findOneForUser(petId, userId);

    const updateQuery: Record<string, unknown> = {};

    if (dto.health) {
      const h = dto.health as Record<string, unknown>;
      if (h.allergies !== undefined) updateQuery['health.allergies'] = h.allergies;
      if (h.conditions !== undefined) updateQuery['health.conditions'] = h.conditions;
      if (h.medications !== undefined) updateQuery['health.medications'] = h.medications;
      if (h.lastVetVisit !== undefined)
        updateQuery['health.lastVetVisit'] = h.lastVetVisit;
      if (h.vaccines !== undefined) {
        const vaccines = h.vaccines as Array<{
          name: string;
          date?: unknown;
          nextDue?: unknown;
        }>;
        updateQuery['health.vaccines'] = vaccines.map((v) => ({
          name: v.name,
          date: v.date,
          ...(v.nextDue != null ? { nextDue: v.nextDue } : {}),
        }));
      }
      if (h.isNeutered !== undefined)
        updateQuery['health.isNeutered'] = h.isNeutered;
      if (h.vetClinic !== undefined) updateQuery['health.vetClinic'] = h.vetClinic;
      if (h.vetPhone !== undefined) updateQuery['health.vetPhone'] = h.vetPhone;
    }

    if (dto.behaviour) {
      const b = dto.behaviour as Record<string, unknown>;
      if (b.walkSchedule !== undefined)
        updateQuery['behaviour.walkSchedule'] = b.walkSchedule;
      if (b.trainingLevel !== undefined)
        updateQuery['behaviour.trainingLevel'] = b.trainingLevel;
      if (b.traits !== undefined) updateQuery['behaviour.traits'] = b.traits;
      if (b.mealTimes !== undefined) updateQuery['behaviour.mealTimes'] = b.mealTimes;
      if (b.knownCommands !== undefined)
        updateQuery['behaviour.knownCommands'] = b.knownCommands;
      if (b.favouriteToys !== undefined)
        updateQuery['behaviour.favouriteToys'] = b.favouriteToys;
    }

    if (dto.grooming) {
      const g = dto.grooming as Record<string, unknown>;
      if (g.lastGroomingDate !== undefined)
        updateQuery['grooming.lastGroomingDate'] = g.lastGroomingDate;
      if (g.frequencyWeeks !== undefined)
        updateQuery['grooming.frequencyWeeks'] = g.frequencyWeeks;
      if (g.atHomeRoutine !== undefined)
        updateQuery['grooming.atHomeRoutine'] = g.atHomeRoutine;
    }

    const topLevel = [
      'name',
      'species',
      'breed',
      'dateOfBirth',
      'gender',
      'weight',
      'profilePhoto',
      'photos',
      'isActive',
    ] as const;
    for (const field of topLevel) {
      if ((dto as Record<string, unknown>)[field] !== undefined) {
        updateQuery[field] = (dto as Record<string, unknown>)[field];
      }
    }

    if (dto.owners !== undefined) {
      updateQuery['owners'] = dto.owners.map((o) => ({
        userId: new Types.ObjectId(o.userId),
        role: o.role,
      }));
    }

    const updated = await this.petModel
      .findByIdAndUpdate(
        new Types.ObjectId(petId),
        { $set: updateQuery },
        { new: true, runValidators: false },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Pet not found');
    }

    return updated;
  }

  async removeForUser(petId: string, userId: string): Promise<void> {
    const pet = await this.findOneForUser(petId, userId);
    pet.isActive = false;
    await pet.save();
  }

  async findByIdInternal(petId: string): Promise<PetDocument | null> {
    if (!Types.ObjectId.isValid(petId)) {
      return null;
    }
    return this.petModel.findById(new Types.ObjectId(petId)).exec();
  }
}
