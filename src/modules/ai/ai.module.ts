import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from '../logs/schemas/log.schema';
import { PetsModule } from '../pets/pets.module';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [
    PetsModule,
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
