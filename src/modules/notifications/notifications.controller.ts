import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences')
  preferences(@GetUser('id') userId: string) {
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences')
  updatePreferences(
    @GetUser('id') userId: string,
    @Body() body: Record<string, boolean>,
  ) {
    return this.notificationsService.updatePreferences(userId, body);
  }

  @Post('push-token')
  @ApiOperation({ summary: 'Register push notification token' })
  registerPushToken(@Body('token') token: string, @GetUser() user: any) {
    return this.notificationsService.savePushToken(user._id.toString(), token);
  }
}
