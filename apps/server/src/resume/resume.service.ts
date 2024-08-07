import {
  CreateResumeDto,
  defaultResumeData,
  UpdateResumeDto,
  ImportResumeDto,
  sampleResume,
  ErrorMessage,
} from 'shared';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as deepmerge from 'deepmerge';

@Injectable()
export class ResumeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(resumeId: string, userId?: string) {
    if (userId) {
      return this.prismaService.resume.findUniqueOrThrow({
        where: {
          userId_id: {
            userId,
            id: resumeId,
          },
        },
      });
    } else {
      const resume = await this.prismaService.resume.findUnique({
        where: { id: resumeId },
      });
      if (!resume) {
        throw new InternalServerErrorException(ErrorMessage.ResumeNotFound);
      }
      return resume;
    }
  }

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const { title, visibility = 'private', description } = createResumeDto;
    const { name, email } = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });

    const resumeData = deepmerge(defaultResumeData, {
      basics: { name, email },
    });

    const resume = await this.prismaService.resume.create({
      data: {
        data: resumeData,
        userId,
        title,
        description,
        visibility,
      },
    });

    return resume;
  }

  async findAll(userId: string) {
    return this.prismaService.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async import(userId: string, importResumeDto: ImportResumeDto) {
    const resume = await this.prismaService.resume.create({
      data: {
        userId,
        title: importResumeDto.title || 'Sample Title',
        description: importResumeDto.description || 'Sample Description',
        data: importResumeDto.data || sampleResume,
        visibility: 'private',
      },
    });
    return resume;
  }

  async update(userId: string, updateResumeDto: UpdateResumeDto) {
    const { title, description, visibility, data, id } = updateResumeDto;
    if (!id) throw new InternalServerErrorException(`Failed to find id ${id}`);
    try {
      return await this.prismaService.resume.update({
        data: {
          title,
          description,
          visibility,
          data,
        },
        where: {
          userId_id: { userId, id },
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to update resume');
    }
  }

  async delete(userId: string, id: string) {
    return await this.prismaService.resume.delete({
      where: {
        userId_id: { userId, id },
      },
    });
  }
}
