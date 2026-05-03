import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { RewardsService } from './rewards.service';

@ApiTags('rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('balance')
  balance(@GetUser('id') userId: string) {
    return this.rewardsService.getBalance(userId);
  }

  @Post('redeem')
  redeem(
    @GetUser('id') userId: string,
    @Body() body: { amountDollars: number },
  ) {
    return this.rewardsService.redeemPoints(userId, body.amountDollars);
  }
}
