"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const user_schema_1 = require("../users/schemas/user.schema");
const logs_service_1 = require("../logs/logs.service");
const users_service_1 = require("../users/users.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(userModel, logsService, usersService, configService) {
        this.userModel = userModel;
        this.logsService = logsService;
        this.usersService = usersService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    resend() {
        const key = this.configService.get('resend.apiKey');
        return key ? new resend_1.Resend(key) : null;
    }
    async sendReEngagementNotification(user) {
        const client = this.resend();
        if (client) {
            await client.emails.send({
                from: 'Pet Profile <onboarding@resend.dev>',
                to: user.email,
                subject: 'We miss you and your pet!',
                html: `<p>Hi ${user.firstName}, log a quick update today to keep your streak going.</p>`,
            });
        }
        else {
            this.logger.log(`Re-engagement stub for ${user.email}`);
        }
    }
    async sendVaccineReminder(user, petName, vaccine) {
        const client = this.resend();
        if (client) {
            await client.emails.send({
                from: 'Pet Profile <onboarding@resend.dev>',
                to: user.email,
                subject: `Vaccine reminder for ${petName}`,
                html: `<p>${vaccine} may be due soon for ${petName}.</p>`,
            });
        }
        else {
            this.logger.log(`Vaccine reminder stub for ${user.email}`);
        }
    }
    async sendGroomingReminder(user, petName) {
        const client = this.resend();
        if (client) {
            await client.emails.send({
                from: 'Pet Profile <onboarding@resend.dev>',
                to: user.email,
                subject: `Grooming reminder for ${petName}`,
                html: `<p>Time to schedule grooming for ${petName}.</p>`,
            });
        }
        else {
            this.logger.log(`Grooming reminder stub for ${user.email}`);
        }
    }
    async sendWeeklySummary(user, summary) {
        const client = this.resend();
        if (client) {
            await client.emails.send({
                from: 'Pet Profile <onboarding@resend.dev>',
                to: user.email,
                subject: 'Your weekly pet summary',
                html: `<p>${summary}</p>`,
            });
        }
        else {
            this.logger.log(`Weekly summary stub for ${user.email}`);
        }
    }
    async dailyReengagementCheck() {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const users = await this.userModel.find().exec();
        for (const user of users) {
            if (!user.notificationPreferences?.pushReEngagement) {
                continue;
            }
            const hasRecent = await this.logsService.hasRecentLog(user.id, since);
            if (!hasRecent) {
                await this.sendReEngagementNotification(user);
            }
        }
    }
    async getPreferences(userId) {
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(userId)).exec();
        return user?.notificationPreferences;
    }
    async savePushToken(userId, token) {
        await this.usersService.updateById(userId, { pushToken: token });
    }
    async updatePreferences(userId, prefs) {
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(userId)).exec();
        if (!user) {
            return null;
        }
        user.notificationPreferences = {
            ...user.notificationPreferences,
            ...prefs,
        };
        await user.save();
        return user.notificationPreferences;
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "dailyReengagementCheck", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        logs_service_1.LogsService,
        users_service_1.UsersService,
        config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map