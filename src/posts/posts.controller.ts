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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';

@ApiTags('posts')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller({ version: '1', path: 'posts' })
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new post' })
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: CreatePostDto })
  create(@Body(new ValidationPipe()) createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get all posts' })
  getPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find post with id' })
  @ApiOkResponse({
    description: 'The found post record',
    type: PostModel,
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  getPostById(@Param() { id }: SearchPostDto) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update post with id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) post: UpdatePostDto,
  ) {
    return this.postsService.update(+id, post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post with id' })
  @ApiNoContentResponse({ description: 'Post was deleted' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  delete(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
