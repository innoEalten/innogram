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
import { PostNotFoundException, ForbiddenPostException } from './exeptions';
import type { User, PaginationResponse, PostWithImages } from '@app/shared';
import { PrismaService } from '@app/prisma';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
    private readonly prisma: PrismaService,
  ) {}

  private static validatePostOwnership(
    postId: UUIDParamDto['id'],
    userId: User['_id'],
  ) {
    if (postId !== userId) {
      throw new ForbiddenPostException();
    }
  }

  create(
    createPostDto: CreatePostDto,
    userId: User['_id'],
    files?: Express.Multer.File[],
  ) {
    return this.prisma.runInTransaction(async () => {
      const newPost = await this.postRepository.create({
        ...createPostDto,
        authorId: userId,
      });

      if (files && files.length > 0) {
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
  }: PaginationQueryDto): Promise<PaginationResponse<PostWithImages>> {
    const [data, total] = await this.postRepository.findManyWithTotal({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const isValidPage = page === 1 || (page <= totalPages && totalPages > 0);

    if (!isValidPage) {
      throw new PostNotFoundException();
    }

    return {
      data,
      page,
      limit,
      total,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };
  }

  async findOne(postId: UUIDParamDto['id']): Promise<PostWithImages> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    return post;
  }

  update(
    postId: UUIDParamDto['id'],
    updatePostDto: UpdatePostDto,
    userId: User['_id'],
  ) {
    return this.prisma.runInTransaction(async () => {
      const post = await this.findOne(postId);
      PostService.validatePostOwnership(post.authorId, userId);

      return this.postRepository.update(postId, updatePostDto);
    });
  }

  delete(postId: UUIDParamDto['id'], userId: User['_id']) {
    return this.prisma.runInTransaction(async () => {
      const post = await this.findOne(postId);
      PostService.validatePostOwnership(post.authorId, userId);

      if (post.images && post.images.length > 0) {
        await this.imageService.deleteImages(post.images);
      }

      return this.postRepository.delete(postId);
    });
  }
}
