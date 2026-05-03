import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@GetUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }
    return this.usersService.sanitize(user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @GetUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.usersService.update(userId, dto);
    return this.usersService.sanitize(updated);
  }
}
