import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto, PaginationQueryDto } from './dto';
import { PostRepository } from './post.repository';
import { ImageService } from '../image/image.service';
import { PostNotFoundException } from './exeptions';
import type { PaginationResponse, Post } from '@app/shared';
import { FileSubdirectory } from '@app/shared';
import { PrismaService } from '@app/prisma';
import { buildPaginationResponse, getPaginationParams } from './utils';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
    private readonly prisma: PrismaService,
  ) {}

  create(
    createPostDto: CreatePostDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    return this.prisma.runInTransaction(async () => {
      const newPost = await this.postRepository.create({
        ...createPostDto,
        authorId: userId,
      });

      await this.imageService.uploadImages(
        files,
        FileSubdirectory.POSTS,
        newPost.id,
      );

      return newPost;
    });
  }

  async findMany({
    page,
    limit,
  }: PaginationQueryDto): Promise<PaginationResponse<Post>> {
    const [data, total] = await this.postRepository.findManyWithTotal(
      getPaginationParams(page, limit),
    );

    return buildPaginationResponse<Post>(data, {
      page,
      limit,
      total,
    });
  }

  async findOne(postId: string): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    return post;
  }

  update(postId: string, updatePostDto: UpdatePostDto) {
    return this.prisma.runInTransaction(async () => {
      return this.postRepository.update(postId, updatePostDto);
    });
  }

  delete(postId: string) {
    return this.prisma.runInTransaction(async () => {
      const post = await this.findOne(postId);
      await this.imageService.deleteImages(post.images);
      return this.postRepository.delete(postId);
    });
  }
}
