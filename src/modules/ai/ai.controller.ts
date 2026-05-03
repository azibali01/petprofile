import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AiService, ChatHistoryItem } from './ai.service';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @GetUser('id') userId: string,
    @Body()
    body: {
      petId: string;
      message: string;
      history?: ChatHistoryItem[];
    },
  ) {
    return this.aiService.chatWithPet(
      userId,
      body.petId,
      body.message,
      body.history ?? [],
    );
  }

  @Post('talk-as-pet')
  async talkAsPet(
    @GetUser('id') userId: string,
    @Body() body: { petId: string; message: string },
  ) {
    return this.aiService.talkAsPet(userId, body.petId, body.message);
  }

  @Post('validate-log')
  async validateLog(
    @GetUser('id') userId: string,
    @Body()
    body: { petId: string; type: string; data: Record<string, unknown> },
  ) {
    return this.aiService.validateLog({
      petId: body.petId,
      userId,
      type: body.type,
      data: body.data,
    });
  }

  @Post('weekly-summary')
  @ApiOperation({ summary: 'Generate weekly pet health summary' })
  async weeklySummary(
    @GetUser('id') userId: string,
    @Body('petId') petId: string,
  ) {
    return this.aiService.generateWeeklySummary(userId, petId);
  }

  @Post('transcribe')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', { storage: multer.memoryStorage() }),
  )
  async transcribe(@UploadedFile() file: Express.Multer.File) {
    const buffer = file?.buffer ?? Buffer.from('');
    return this.aiService.transcribeVoice(buffer);
  }
}
