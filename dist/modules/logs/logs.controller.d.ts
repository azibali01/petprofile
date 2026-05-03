import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    create(userId: string, dto: CreateLogDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}, {}> & import("./schemas/log.schema").Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    listByPet(petId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}, {}> & import("./schemas/log.schema").Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    deleteLog(id: string, user: any): Promise<void>;
}
