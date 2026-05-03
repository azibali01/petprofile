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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const log_schema_1 = require("./schemas/log.schema");
const pets_service_1 = require("../pets/pets.service");
const users_service_1 = require("../users/users.service");
const ai_service_1 = require("../ai/ai.service");
const rewards_service_1 = require("../rewards/rewards.service");
let LogsService = class LogsService {
    constructor(logModel, petsService, usersService, aiService, rewardsService) {
        this.logModel = logModel;
        this.petsService = petsService;
        this.usersService = usersService;
        this.aiService = aiService;
        this.rewardsService = rewardsService;
    }
    async create(userId, dto) {
        await this.petsService.findOneForUser(dto.petId, userId);
        const isValid = await this.aiService.validateLog({
            petId: dto.petId,
            userId,
            type: dto.type,
            data: dto.data,
        });
        const log = new this.logModel({
            petId: new mongoose_2.Types.ObjectId(dto.petId),
            userId: new mongoose_2.Types.ObjectId(userId),
            type: dto.type,
            data: dto.data,
            isValidated: isValid,
            voiceTranscript: dto.voiceTranscript,
            attachments: dto.attachments ?? [],
            loggedAt: dto.loggedAt ? new Date(dto.loggedAt) : new Date(),
        });
        const saved = await log.save();
        if (isValid) {
            await this.rewardsService.awardPoints(userId, saved.id);
        }
        await this.usersService.touchLastLog(userId, saved.loggedAt);
        return saved;
    }
    async listByPet(petId, userId) {
        await this.petsService.findOneForUser(petId, userId);
        return this.logModel
            .find({ petId: new mongoose_2.Types.ObjectId(petId) })
            .sort({ loggedAt: -1 })
            .exec();
    }
    async recentForPet(petId, limit = 20) {
        return this.logModel
            .find({ petId: new mongoose_2.Types.ObjectId(petId) })
            .sort({ loggedAt: -1 })
            .limit(limit)
            .exec();
    }
    async logsInRange(petId, from, to) {
        return this.logModel
            .find({
            petId: new mongoose_2.Types.ObjectId(petId),
            loggedAt: { $gte: from, $lte: to },
        })
            .exec();
    }
    async findById(logId) {
        if (!mongoose_2.Types.ObjectId.isValid(logId)) {
            return null;
        }
        return this.logModel.findById(new mongoose_2.Types.ObjectId(logId)).exec();
    }
    async countValidatedForUser(userId) {
        return this.logModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            isValidated: true,
        });
    }
    async hasRecentLog(userId, since) {
        const found = await this.logModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            loggedAt: { $gte: since },
        })
            .exec();
        return !!found;
    }
    async findDuplicateCandidate(petId, type, windowStart) {
        return this.logModel
            .findOne({
            petId: new mongoose_2.Types.ObjectId(petId),
            type,
            loggedAt: { $gte: windowStart },
        })
            .exec();
    }
    async deleteLog(id, userId) {
        const log = await this.logModel.findById(id).exec();
        if (!log)
            throw new common_1.NotFoundException('Log not found');
        if (log.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await this.logModel.findByIdAndDelete(id).exec();
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pets_service_1.PetsService,
        users_service_1.UsersService,
        ai_service_1.AiService,
        rewards_service_1.RewardsService])
], LogsService);
//# sourceMappingURL=logs.service.js.map