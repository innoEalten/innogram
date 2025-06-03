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
import { PostNotFoundException, AtLeastOneImageException } from './exceptions';
import { Transactional } from '@nestjs-cls/transactional';
import { ImageNotFoundException } from '../image/exceptions';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
  ) {}

  private validateImageRemoval(post: Post, removeImageIds: string[]) {
    const existingImageIds = post.images.map(({ id }) => id);

    if (removeImageIds.some((id) => !existingImageIds.includes(id))) {
      throw new ImageNotFoundException();
    }

    if (existingImageIds.length - removeImageIds.length < 1) {
      throw new AtLeastOneImageException();
    }
  }

  @Transactional()
  async create(
    createPostDto: CreatePostDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
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
  }

  @Transactional()
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

  @Transactional()
  async update(postId: string, { removeImageIds, body, title }: UpdatePostDto) {
    const post = await this.findOne(postId);

    if (removeImageIds?.length) {
      this.validateImageRemoval(post, removeImageIds);

      await this.imageService.deleteImages(
        post.images.filter(({ id }) => removeImageIds.includes(id)),
      );
    }

    if (body || title) {
      await this.postRepository.update(postId, {
        body,
        title,
      });
    }

    return this.findOne(postId);
  }

  @Transactional()
  async delete(postId: string) {
    const post = await this.findOne(postId);

    if (post.images.length) {
      await this.imageService.deleteImages(post.images);
    }

    return this.postRepository.delete(postId);
  }
}
