import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  UserWithPrivateInfo,
  userListSchema,
  userSchema,
} from '@fe-cookie/resume-generator-shared';
import { User } from '@/user/decorators/user.decorator';
import { JwtGuard } from '@/auth/guards/jwt.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllUser() {
    const list = await this.userService.findAll();
    return userListSchema.parse(list);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@User() user: UserWithPrivateInfo) {
    return userSchema.parse(user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string) {
    return userSchema.parse(await this.userService.findOneById(id));
  }
}
