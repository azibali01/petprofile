import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    preferences(userId: string): Promise<{
        emailDaily: boolean;
        pushReEngagement: boolean;
        pushVaccine: boolean;
        pushGrooming: boolean;
        pushWeeklySummary: boolean;
    } | undefined>;
    updatePreferences(userId: string, body: Record<string, boolean>): Promise<{
        emailDaily: boolean;
        pushReEngagement: boolean;
        pushVaccine: boolean;
        pushGrooming: boolean;
        pushWeeklySummary: boolean;
    } | null>;
    registerPushToken(token: string, user: any): Promise<void>;
}
