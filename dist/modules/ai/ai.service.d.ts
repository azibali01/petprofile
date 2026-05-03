import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { PetsService } from '../pets/pets.service';
import { LogDocument } from '../logs/schemas/log.schema';
export type ChatHistoryItem = {
    role: 'user' | 'assistant';
    content: string;
};
export declare class AiService {
    private readonly configService;
    private readonly petsService;
    private readonly logModel;
    constructor(configService: ConfigService, petsService: PetsService, logModel: Model<LogDocument>);
    private openai;
    chatWithPet(userId: string, petId: string, message: string, history?: ChatHistoryItem[]): Promise<string>;
    talkAsPet(userId: string, petId: string, message: string): Promise<string>;
    validateLog(input: {
        petId: string;
        userId: string;
        type: string;
        data: Record<string, unknown>;
    }): Promise<boolean>;
    generateWeeklySummary(userId: string, petId: string): Promise<{
        summary: string;
    }>;
    transcribeVoice(audioBuffer: Buffer): Promise<string>;
}
