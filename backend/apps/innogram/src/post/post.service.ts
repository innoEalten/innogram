import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { ImageService } from '../image/image.service';
import { FileSubdirectory } from '../file/enum/file.enum';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user_id: string,
    files: Express.Multer.File[],
  ) {
    const images = [];

    for (const file of files) {
      const filename = `${user_id}-${Date.now()}-${file.originalname}`;

      const image = await this.imageService.uploadImage(
        file,
        filename,
        FileSubdirectory.POSTS,
      );

      images.push(image);
    }

    return this.postRepository.create(
      {
        ...createPostDto,
        author_id: user_id,
      },
      images.map((image) => image.id),
    );
  }

  async findAll() {
    return this.postRepository.findAll();
  }

  async findOne(id: string) {
    return this.postRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    return this.postRepository.delete(id);
  }
}
