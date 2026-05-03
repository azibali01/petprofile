import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LogsService } from '../logs/logs.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly logsService: LogsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private resend(): Resend | null {
    const key = this.configService.get<string>('resend.apiKey');
    return key ? new Resend(key) : null;
  }

  async sendReEngagementNotification(user: UserDocument) {
    const client = this.resend();
    if (client) {
      await client.emails.send({
        from: 'Pet Profile <onboarding@resend.dev>',
        to: user.email,
        subject: 'We miss you and your pet!',
        html: `<p>Hi ${user.firstName}, log a quick update today to keep your streak going.</p>`,
      });
    } else {
      this.logger.log(`Re-engagement stub for ${user.email}`);
    }
  }

  async sendVaccineReminder(user: UserDocument, petName: string, vaccine: string) {
    const client = this.resend();
    if (client) {
      await client.emails.send({
        from: 'Pet Profile <onboarding@resend.dev>',
        to: user.email,
        subject: `Vaccine reminder for ${petName}`,
        html: `<p>${vaccine} may be due soon for ${petName}.</p>`,
      });
    } else {
      this.logger.log(`Vaccine reminder stub for ${user.email}`);
    }
  }

  async sendGroomingReminder(user: UserDocument, petName: string) {
    const client = this.resend();
    if (client) {
      await client.emails.send({
        from: 'Pet Profile <onboarding@resend.dev>',
        to: user.email,
        subject: `Grooming reminder for ${petName}`,
        html: `<p>Time to schedule grooming for ${petName}.</p>`,
      });
    } else {
      this.logger.log(`Grooming reminder stub for ${user.email}`);
    }
  }

  async sendWeeklySummary(user: UserDocument, summary: string) {
    const client = this.resend();
    if (client) {
      await client.emails.send({
        from: 'Pet Profile <onboarding@resend.dev>',
        to: user.email,
        subject: 'Your weekly pet summary',
        html: `<p>${summary}</p>`,
      });
    } else {
      this.logger.log(`Weekly summary stub for ${user.email}`);
    }
  }

  @Cron('0 9 * * *')
  async dailyReengagementCheck() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const users = await this.userModel.find().exec();
    for (const user of users) {
      if (!user.notificationPreferences?.pushReEngagement) {
        continue;
      }
      const hasRecent = await this.logsService.hasRecentLog(
        user.id,
        since,
      );
      if (!hasRecent) {
        await this.sendReEngagementNotification(user);
      }
    }
  }

  async getPreferences(userId: string) {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    return user?.notificationPreferences;
  }

  async savePushToken(userId: string, token: string): Promise<void> {
    await this.usersService.updateById(userId, { pushToken: token });
  }

  async updatePreferences(
    userId: string,
    prefs: Partial<User['notificationPreferences']>,
  ) {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
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
}
