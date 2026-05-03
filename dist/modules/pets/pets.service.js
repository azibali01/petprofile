"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pet_schema_1 = require("./schemas/pet.schema");
let PetsService = class PetsService {
    constructor(petModel) {
        this.petModel = petModel;
    }
    assertOwner(pet, userId) {
        const owners = pet.owners ?? [];
        const ok = owners.some((o) => o.userId.toString() === userId || String(o.userId) === userId);
        if (!ok) {
            throw new common_1.ForbiddenException('Not an owner of this pet');
        }
    }
    async createForUser(userId, dto) {
        const owners = dto.owners?.map((o) => ({
            userId: new mongoose_2.Types.ObjectId(o.userId),
            role: o.role,
        })) ?? [{ userId: new mongoose_2.Types.ObjectId(userId), role: 'primary' }];
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
    async listForUser(userId) {
        return this.petModel
            .find({ 'owners.userId': new mongoose_2.Types.ObjectId(userId), isActive: true })
            .exec();
    }
    async findOneForUser(petId, userId) {
        const pet = await this.petModel.findById(new mongoose_2.Types.ObjectId(petId)).exec();
        if (!pet) {
            throw new common_1.NotFoundException('Pet not found');
        }
        this.assertOwner(pet, userId);
        return pet;
    }
    async updateForUser(petId, userId, dto) {
        await this.findOneForUser(petId, userId);
        const updateQuery = {};
        if (dto.health) {
            const h = dto.health;
            if (h.allergies !== undefined)
                updateQuery['health.allergies'] = h.allergies;
            if (h.conditions !== undefined)
                updateQuery['health.conditions'] = h.conditions;
            if (h.medications !== undefined)
                updateQuery['health.medications'] = h.medications;
            if (h.lastVetVisit !== undefined)
                updateQuery['health.lastVetVisit'] = h.lastVetVisit;
            if (h.vaccines !== undefined) {
                const vaccines = h.vaccines;
                updateQuery['health.vaccines'] = vaccines.map((v) => ({
                    name: v.name,
                    date: v.date,
                    ...(v.nextDue != null ? { nextDue: v.nextDue } : {}),
                }));
            }
            if (h.isNeutered !== undefined)
                updateQuery['health.isNeutered'] = h.isNeutered;
            if (h.vetClinic !== undefined)
                updateQuery['health.vetClinic'] = h.vetClinic;
            if (h.vetPhone !== undefined)
                updateQuery['health.vetPhone'] = h.vetPhone;
        }
        if (dto.behaviour) {
            const b = dto.behaviour;
            if (b.walkSchedule !== undefined)
                updateQuery['behaviour.walkSchedule'] = b.walkSchedule;
            if (b.trainingLevel !== undefined)
                updateQuery['behaviour.trainingLevel'] = b.trainingLevel;
            if (b.traits !== undefined)
                updateQuery['behaviour.traits'] = b.traits;
            if (b.mealTimes !== undefined)
                updateQuery['behaviour.mealTimes'] = b.mealTimes;
            if (b.knownCommands !== undefined)
                updateQuery['behaviour.knownCommands'] = b.knownCommands;
            if (b.favouriteToys !== undefined)
                updateQuery['behaviour.favouriteToys'] = b.favouriteToys;
        }
        if (dto.grooming) {
            const g = dto.grooming;
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
        ];
        for (const field of topLevel) {
            if (dto[field] !== undefined) {
                updateQuery[field] = dto[field];
            }
        }
        if (dto.owners !== undefined) {
            updateQuery['owners'] = dto.owners.map((o) => ({
                userId: new mongoose_2.Types.ObjectId(o.userId),
                role: o.role,
            }));
        }
        const updated = await this.petModel
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(petId), { $set: updateQuery }, { new: true, runValidators: false })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException('Pet not found');
        }
        return updated;
    }
    async removeForUser(petId, userId) {
        const pet = await this.findOneForUser(petId, userId);
        pet.isActive = false;
        await pet.save();
    }
    async findByIdInternal(petId) {
        if (!mongoose_2.Types.ObjectId.isValid(petId)) {
            return null;
        }
        return this.petModel.findById(new mongoose_2.Types.ObjectId(petId)).exec();
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pet_schema_1.Pet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PetsService);
//# sourceMappingURL=pets.service.js.map