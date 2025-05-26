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
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostDto,
  UUIDParamDto,
  UpdatePostDto,
  PaginationQueryDto,
} from './dto';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import type { User as UserType } from '@app/shared';
import { postImagesFileValidationPipe } from './pipes/post-images-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadPostForm } from './decorators/upload-post-form.decorator';
import { PostOwnerGuard } from './guards';

const MAX_FILE_NUMBER = 5;

@Controller('posts')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @uploadPostForm
  @UseInterceptors(FilesInterceptor('files', MAX_FILE_NUMBER))
  create(
    @Body() createPostDto: CreatePostDto,
    @User() { _id }: UserType,
    @UploadedFiles(postImagesFileValidationPipe)
    files: Express.Multer.File[],
  ) {
    return this.postService.create(createPostDto, _id, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of posts' })
  @ApiResponse({
    status: 200,
    description: 'List of posts returned successfully',
  })
  findMany(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.postService.findMany(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post returned successfully',
  })
  findOne(@Param() { id: postId }: UUIDParamDto) {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (optionally replace/add images)' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @UseGuards(PostOwnerGuard)
  update(
    @Param() { id: postId }: UUIDParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @UseGuards(PostOwnerGuard)
  delete(@Param() { id: postId }: UUIDParamDto) {
    return this.postService.delete(postId);
  }
}
