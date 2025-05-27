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
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import {
  type User as UserType,
  FileConfig,
  PaginationQueryDto,
} from '@app/shared';
import { postImagesFileValidationPipe } from './pipes/post-images-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBodyUploadPost } from './decorators';
import { PostOwnerGuard } from './guards';
import { CompensationInterceptor } from '../compensation';

@Controller('posts')
@UseGuards(JwtGuard)
@UseInterceptors(CompensationInterceptor)
@ApiBearerAuth()
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiBodyUploadPost
  @UseInterceptors(FilesInterceptor('files', FileConfig.MAX_FILE_NUMBER))
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (optionally replace/add images)' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @UseGuards(PostOwnerGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @UseGuards(PostOwnerGuard)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.delete(id);
  }
}
