import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import {
  type PaginationResponse,
  type Post,
  PaginationQueryDto,
  getPaginationParams,
  buildPaginationResponse,
  FileSubdirectory,
} from '@app/shared';
import { PostRepository } from './post.repository';
import { ImageService } from '../image/image.service';
import { PostNotFoundException } from './exeptions';
import { PrismaService } from '@app/prisma';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
    private readonly prismaService: PrismaService,
  ) {}

  create(
    createPostDto: CreatePostDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    return this.prismaService.runInTransaction(async () => {
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
    return this.prismaService.runInTransaction(async () => {
      return this.postRepository.update(postId, updatePostDto);
    });
  }

  delete(postId: string) {
    return this.prismaService.runInTransaction(async () => {
      const post = await this.findOne(postId);

      if (post.images.length > 0) {
        await this.imageService.deleteImages(post.images);
      }

      return this.postRepository.delete(postId);
    });
  }
}
