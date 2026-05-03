import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schemas/log.schema';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { AiModule } from '../ai/ai.module';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    PetsModule,
    UsersModule,
    AiModule,
    RewardsModule,
  ],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
