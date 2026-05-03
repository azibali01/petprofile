import { AiService, ChatHistoryItem } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    chat(userId: string, body: {
        petId: string;
        message: string;
        history?: ChatHistoryItem[];
    }): Promise<string>;
    talkAsPet(userId: string, body: {
        petId: string;
        message: string;
    }): Promise<string>;
    validateLog(userId: string, body: {
        petId: string;
        type: string;
        data: Record<string, unknown>;
    }): Promise<boolean>;
    weeklySummary(userId: string, petId: string): Promise<{
        summary: string;
    }>;
    transcribe(file: Express.Multer.File): Promise<string>;
}
