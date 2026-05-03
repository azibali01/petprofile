import { RewardsService } from './rewards.service';
export declare class RewardsController {
    private readonly rewardsService;
    constructor(rewardsService: RewardsService);
    balance(userId: string): Promise<{
        dollars: number;
        cents: number;
    }>;
    redeem(userId: string, body: {
        amountDollars: number;
    }): Promise<void>;
}
