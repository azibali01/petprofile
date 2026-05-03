import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';

@ApiTags('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateLogDto) {
    return this.logsService.create(userId, dto);
  }

  @Get('pet/:petId')
  listByPet(@Param('petId') petId: string, @GetUser('id') userId: string) {
    return this.logsService.listByPet(petId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a log' })
  deleteLog(@Param('id') id: string, @GetUser() user: any) {
    return this.logsService.deleteLog(id, user._id.toString());
  }
}
