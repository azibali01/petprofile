import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PetsModule } from './modules/pets/pets.module';
import { LogsModule } from './modules/logs/logs.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RewardsModule } from './modules/rewards/rewards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PetsModule,
    LogsModule,
    AiModule,
    NotificationsModule,
    DocumentsModule,
    RewardsModule,
  ],
})
export class AppModule {}
