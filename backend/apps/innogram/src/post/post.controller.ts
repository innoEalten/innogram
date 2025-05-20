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
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import type { User as UserType } from '@app/shared';
import { postImagesFileValidationPipe } from './pipes/post-images-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new post with optional images' })
  @ApiBody({
    description: 'Form data including post fields and files',
    type: CreatePostDto,
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(
    @Body() createPostDto: CreatePostDto,
    @User() { _id }: UserType,
    @UploadedFiles(postImagesFileValidationPipe)
    files?: Express.Multer.File[],
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
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the post (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Post returned successfully',
  })
  findOne(@Param() { id: postId }: UUIDParamDto) {
    return this.postService.findOne(postId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (optionally replace/add images)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post ID (UUID)' })
  @ApiBody({
    description: 'Partial post fields and optional images',
    type: UpdatePostDto,
  })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  update(
    @Param() { id: postId }: UUIDParamDto,
    @Body() updatePostDto: UpdatePostDto,
    @User() { _id }: UserType,
  ) {
    return this.postService.update(postId, updatePostDto, _id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the post (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  delete(@Param() { id: postId }: UUIDParamDto, @User() { _id }: UserType) {
    return this.postService.delete(postId, _id);
  }
}
