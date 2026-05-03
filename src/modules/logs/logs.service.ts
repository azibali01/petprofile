import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
    private readonly rewardsService: RewardsService,
  ) {}

  async create(userId: string, dto: CreateLogDto): Promise<LogDocument> {
    await this.petsService.findOneForUser(dto.petId, userId);

    const isValid = await this.aiService.validateLog({
      petId: dto.petId,
      userId,
      type: dto.type,
      data: dto.data,
    });

    const log = new this.logModel({
      petId: new Types.ObjectId(dto.petId),
      userId: new Types.ObjectId(userId),
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

  async listByPet(petId: string, userId: string): Promise<LogDocument[]> {
    await this.petsService.findOneForUser(petId, userId);
    return this.logModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ loggedAt: -1 })
      .exec();
  }

  async recentForPet(petId: string, limit = 20): Promise<LogDocument[]> {
    return this.logModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ loggedAt: -1 })
      .limit(limit)
      .exec();
  }

  async logsInRange(
    petId: string,
    from: Date,
    to: Date,
  ): Promise<LogDocument[]> {
    return this.logModel
      .find({
        petId: new Types.ObjectId(petId),
        loggedAt: { $gte: from, $lte: to },
      })
      .exec();
  }

  async findById(logId: string): Promise<LogDocument | null> {
    if (!Types.ObjectId.isValid(logId)) {
      return null;
    }
    return this.logModel.findById(new Types.ObjectId(logId)).exec();
  }

  async countValidatedForUser(userId: string): Promise<number> {
    return this.logModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isValidated: true,
    });
  }

  async hasRecentLog(userId: string, since: Date): Promise<boolean> {
    const found = await this.logModel
      .findOne({
        userId: new Types.ObjectId(userId),
        loggedAt: { $gte: since },
      })
      .exec();
    return !!found;
  }

  async findDuplicateCandidate(
    petId: string,
    type: string,
    windowStart: Date,
  ): Promise<LogDocument | null> {
    return this.logModel
      .findOne({
        petId: new Types.ObjectId(petId),
        type,
        loggedAt: { $gte: windowStart },
      })
      .exec();
  }

  async deleteLog(id: string, userId: string): Promise<void> {
    const log = await this.logModel.findById(id).exec();
    if (!log) throw new NotFoundException('Log not found');
    if (log.userId.toString() !== userId) throw new ForbiddenException();
    await this.logModel.findByIdAndDelete(id).exec();
  }
}
