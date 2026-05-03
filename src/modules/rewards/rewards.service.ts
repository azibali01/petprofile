import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Log, LogDocument } from '../logs/schemas/log.schema';
import {
  RewardTransaction,
  RewardTransactionDocument,
} from './schemas/reward-transaction.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    @InjectModel(RewardTransaction.name)
    private readonly txModel: Model<RewardTransactionDocument>,
  ) {}

  async awardPoints(userId: string, logId: string): Promise<void> {
    const log = await this.logModel.findById(new Types.ObjectId(logId)).exec();
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
      userId: new Types.ObjectId(userId),
      isValidated: true,
    });

    const incrementCents =
      validatedCount <= 50 ? 1 : validatedCount <= 100 ? 0.5 : 0.25;

    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $inc: { rewardPoints: incrementCents } },
    );

    log.pointsAwarded = incrementCents;
    await log.save();

    await this.txModel.create({
      userId: new Types.ObjectId(userId),
      amountCents: incrementCents,
      logId: log._id,
      type: 'award',
    });
  }

  async getBalance(userId: string): Promise<{ dollars: number; cents: number }> {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cents = user.rewardPoints ?? 0;
    return { dollars: cents / 100, cents };
  }

  async redeemPoints(userId: string, amountDollars: number): Promise<void> {
    if (amountDollars <= 0) {
      throw new BadRequestException('Amount must be positive');
    }
    const centsToRedeem = Math.round(amountDollars * 100);
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const current = user.rewardPoints ?? 0;
    if (current < centsToRedeem) {
      throw new BadRequestException('Insufficient points balance');
    }
    await this.userModel.updateOne(
      { _id: user._id },
      { $inc: { rewardPoints: -centsToRedeem } },
    );
    await this.txModel.create({
      userId: user._id,
      amountCents: -centsToRedeem,
      type: 'redeem',
    });
  }
}
