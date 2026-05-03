import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { LogDocument } from '../logs/schemas/log.schema';
import { RewardTransactionDocument } from './schemas/reward-transaction.schema';
export declare class RewardsService {
    private readonly userModel;
    private readonly logModel;
    private readonly txModel;
    constructor(userModel: Model<UserDocument>, logModel: Model<LogDocument>, txModel: Model<RewardTransactionDocument>);
    awardPoints(userId: string, logId: string): Promise<void>;
    getBalance(userId: string): Promise<{
        dollars: number;
        cents: number;
    }>;
    redeemPoints(userId: string, amountDollars: number): Promise<void>;
}
