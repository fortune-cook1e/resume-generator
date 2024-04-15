import { JwtGuard } from '@/auth/guards/jwt.guard';
import { ResumeService } from '@/resume/resume.service';
import { UseUser } from '@/user/decorators/user.decorator';
import {
  CreateResumeDto,
  DeleteResumeDto,
  ImportResumeDto,
  UpdateResumeDto,
  User,
} from 'shared';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resume: ResumeService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async createResume(@UseUser() user: User, @Body() data: CreateResumeDto) {
    return await this.resume.create(user.id, data);
  }

  @Post('update')
  @UseGuards(JwtGuard)
  async updateResume(@UseUser() user: User, @Body() data: UpdateResumeDto) {
    return await this.resume.update(user.id, data);
  }

  @Post('import')
  @UseGuards(JwtGuard)
  async importResume(@UseUser() user: User, @Body() data: ImportResumeDto) {
    return await this.resume.import(user.id, data);
  }

  @Get('list')
  @UseGuards(JwtGuard)
  async getResumeList(@UseUser() user: User) {
    return await this.resume.findAll(user.id);
  }

  @Post('delete')
  @UseGuards(JwtGuard)
  async deleteResume(@UseUser() user: User, @Body() data: DeleteResumeDto) {
    return await this.resume.delete(user.id, data.id);
  }

  @Get('')
  @UseGuards(JwtGuard)
  async getResume(@Query('id') id: string) {
    return await this.resume.findOneById(id);
  }
}
