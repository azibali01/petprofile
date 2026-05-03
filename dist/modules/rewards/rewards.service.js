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
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const log_schema_1 = require("../logs/schemas/log.schema");
const reward_transaction_schema_1 = require("./schemas/reward-transaction.schema");
let RewardsService = class RewardsService {
    constructor(userModel, logModel, txModel) {
        this.userModel = userModel;
        this.logModel = logModel;
        this.txModel = txModel;
    }
    async awardPoints(userId, logId) {
        const log = await this.logModel.findById(new mongoose_2.Types.ObjectId(logId)).exec();
        if (!log || !log.isValidated) {
            return;
        }
        if (log.userId.toString() !== userId) {
            return;
        }
        if ((log.pointsAwarded ?? 0) > 0) {
            return;
        }
        const validatedCount = await this.logModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            isValidated: true,
        });
        const incrementCents = validatedCount <= 50 ? 1 : validatedCount <= 100 ? 0.5 : 0.25;
        await this.userModel.updateOne({ _id: new mongoose_2.Types.ObjectId(userId) }, { $inc: { rewardPoints: incrementCents } });
        log.pointsAwarded = incrementCents;
        await log.save();
        await this.txModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            amountCents: incrementCents,
            logId: log._id,
            type: 'award',
        });
    }
    async getBalance(userId) {
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(userId)).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const cents = user.rewardPoints ?? 0;
        return { dollars: cents / 100, cents };
    }
    async redeemPoints(userId, amountDollars) {
        if (amountDollars <= 0) {
            throw new common_1.BadRequestException('Amount must be positive');
        }
        const centsToRedeem = Math.round(amountDollars * 100);
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(userId)).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const current = user.rewardPoints ?? 0;
        if (current < centsToRedeem) {
            throw new common_1.BadRequestException('Insufficient points balance');
        }
        await this.userModel.updateOne({ _id: user._id }, { $inc: { rewardPoints: -centsToRedeem } });
        await this.txModel.create({
            userId: user._id,
            amountCents: -centsToRedeem,
            type: 'redeem',
        });
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __param(2, (0, mongoose_1.InjectModel)(reward_transaction_schema_1.RewardTransaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map