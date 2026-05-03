import { Model } from 'mongoose';
import { LogDocument } from './schemas/log.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { RewardsService } from '../rewards/rewards.service';
export declare class LogsService {
    private readonly logModel;
    private readonly petsService;
    private readonly usersService;
    private readonly aiService;
    private readonly rewardsService;
    constructor(logModel: Model<LogDocument>, petsService: PetsService, usersService: UsersService, aiService: AiService, rewardsService: RewardsService);
    create(userId: string, dto: CreateLogDto): Promise<LogDocument>;
    listByPet(petId: string, userId: string): Promise<LogDocument[]>;
    recentForPet(petId: string, limit?: number): Promise<LogDocument[]>;
    logsInRange(petId: string, from: Date, to: Date): Promise<LogDocument[]>;
    findById(logId: string): Promise<LogDocument | null>;
    countValidatedForUser(userId: string): Promise<number>;
    hasRecentLog(userId: string, since: Date): Promise<boolean>;
    findDuplicateCandidate(petId: string, type: string, windowStart: Date): Promise<LogDocument | null>;
    deleteLog(id: string, userId: string): Promise<void>;
}
