import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Log, LogSchema } from '../logs/schemas/log.schema';
import {
  RewardTransaction,
  RewardTransactionSchema,
} from './schemas/reward-transaction.schema';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Log.name, schema: LogSchema },
      { name: RewardTransaction.name, schema: RewardTransactionSchema },
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
