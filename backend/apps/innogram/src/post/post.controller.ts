import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType } from '@app/shared';
import { postImagesFileValidationPipe } from './pipes/post-images-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: UserType,
    @UploadedFiles(postImagesFileValidationPipe)
    files: Express.Multer.File[],
  ) {
    return this.postService.create(createPostDto, user._id, files);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
