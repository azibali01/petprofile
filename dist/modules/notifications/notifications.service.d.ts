import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LogsService } from '../logs/logs.service';
import { UsersService } from '../users/users.service';
export declare class NotificationsService {
    private readonly userModel;
    private readonly logsService;
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, logsService: LogsService, usersService: UsersService, configService: ConfigService);
    private resend;
    sendReEngagementNotification(user: UserDocument): Promise<void>;
    sendVaccineReminder(user: UserDocument, petName: string, vaccine: string): Promise<void>;
    sendGroomingReminder(user: UserDocument, petName: string): Promise<void>;
    sendWeeklySummary(user: UserDocument, summary: string): Promise<void>;
    dailyReengagementCheck(): Promise<void>;
    getPreferences(userId: string): Promise<{
        emailDaily: boolean;
        pushReEngagement: boolean;
        pushVaccine: boolean;
        pushGrooming: boolean;
        pushWeeklySummary: boolean;
    } | undefined>;
    savePushToken(userId: string, token: string): Promise<void>;
    updatePreferences(userId: string, prefs: Partial<User['notificationPreferences']>): Promise<{
        emailDaily: boolean;
        pushReEngagement: boolean;
        pushVaccine: boolean;
        pushGrooming: boolean;
        pushWeeklySummary: boolean;
    } | null>;
}
