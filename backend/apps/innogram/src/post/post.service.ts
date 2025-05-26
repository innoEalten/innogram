import { Injectable } from '@nestjs/common';
import {
  CreatePostDto,
  UpdatePostDto,
  UUIDParamDto,
  PaginationQueryDto,
} from './dto';
import { PostRepository } from './post.repository';
import { ImageService } from '../image/image.service';
import { FileSubdirectory } from '../file/enum/file.enum';
import { PostNotFoundException } from './exeptions';
import type { User, PaginationResponse, Post } from '@app/shared';
import { PrismaService } from '@app/prisma';
import { buildPaginationResponse } from './utils';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
    private readonly prisma: PrismaService,
  ) {}

  create(
    createPostDto: CreatePostDto,
    userId: User['_id'],
    files: Express.Multer.File[],
  ) {
    return this.prisma.runInTransaction(async () => {
      const newPost = await this.postRepository.create({
        ...createPostDto,
        authorId: userId,
      });

      if (files.length > 0) {
        await this.imageService.uploadImages(
          files,
          FileSubdirectory.POSTS,
          newPost.id,
        );
      }

      return newPost;
    });
  }

  async findMany({
    page,
    limit,
  }: PaginationQueryDto): Promise<PaginationResponse<Post>> {
    const [data, total] = await this.postRepository.findManyWithTotal({
      skip: (page - 1) * limit,
      take: limit,
    });

    return buildPaginationResponse<Post>(data, {
      page,
      limit,
      total,
    });
  }

  async findOne(postId: UUIDParamDto['id']): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    return post;
  }

  update(postId: UUIDParamDto['id'], updatePostDto: UpdatePostDto) {
    return this.prisma.runInTransaction(async () => {
      return this.postRepository.update(postId, updatePostDto);
    });
  }

  delete(postId: UUIDParamDto['id']) {
    return this.prisma.runInTransaction(async () => {
      const post = await this.findOne(postId);

      if (post.images && post.images.length > 0) {
        await this.imageService.deleteImages(post.images);
      }

      return this.postRepository.delete(postId);
    });
  }
}
