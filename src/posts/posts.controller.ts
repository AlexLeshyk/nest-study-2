import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostModel } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body(new ValidationPipe()) createPostDto: CreatePostDto) {
    this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find post with id' })
  @ApiResponse({
    status: 200,
    description: 'The found post record',
    type: PostModel,
  })
  getOnePost(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update post with id' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) post: UpdatePostDto,
  ) {
    return this.postsService.update(+id, post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post with id' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  delete(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
