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
import { PostNotFoundException } from './exceptions';
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

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginationResponse<Post>> {
    const [data, total] = await this.postRepository.findManyWithTotal(
      getPaginationParams(paginationQueryDto),
    );

    return buildPaginationResponse<Post>(data, {
      ...paginationQueryDto,
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

  update(postId: string, { removeImageIds, body, title }: UpdatePostDto) {
    return this.prismaService.runInTransaction(async () => {
      if (removeImageIds?.length) {
        for (const imageId of removeImageIds) {
          const image = await this.imageService.findOne(imageId);

          if (image.postId === postId) {
            await this.imageService.deleteImage(image);
          }
        }
      }

      if (body || title) {
        await this.postRepository.update(postId, {
          body,
          title,
        });
      }

      return this.postRepository.findOne(postId);
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
