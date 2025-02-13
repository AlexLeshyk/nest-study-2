import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  private posts: PostModel[] = [
    {
      title: '1',
      content: '1',
      id: '1',
      meta: {
        createdAt: '02.02.2025',
        updatedAt: '',
      },
      postImages: [
        {
          src: 'https://avatarzo.ru/wp-content/uploads/kolenok-na-plede.jpg',
          description: 'image',
        },
      ],
    },
    {
      title: '2',
      content: '2',
      id: '2',
      meta: {
        createdAt: '03.02.2025',
        updatedAt: '',
      },
      postImages: [
        {
          src: 'https://avatarzo.ru/wp-content/uploads/oduvanchik-na-solncze.jpg',
          description: 'image',
        },
      ],
    },
    {
      title: '3',
      content: '3',
      id: '3',
      meta: {
        createdAt: '04.02.2025',
        updatedAt: '',
      },
      postImages: [
        {
          src: 'https://avatarzo.ru/wp-content/uploads/kolenok-na-plede.jpg',
          description: 'image',
        },
      ],
    },
    {
      title: 'Title',
      content: '4',
      id: '4',
      meta: {
        createdAt: '04.02.2025',
        updatedAt: '',
      },
      postImages: [
        {
          src: 'https://avatarzo.ru/wp-content/uploads/oduvanchik-na-solncze.jpg',
          description: 'image',
        },
      ],
    },
  ];

  create(createPostDto: CreatePostDto) {
    const postsLength = this.posts.length;
    try {
      this.posts.push({
        title: createPostDto.title,
        content: createPostDto.content,
        id: String(postsLength + 1),
        meta: {
          createdAt: new Date().toLocaleDateString(),
          updatedAt: '',
        },
        postImages: createPostDto.images,
      });
    } catch (error) {
      throw new HttpException(
        'Error creating new post',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  async findAll(): Promise<PostModel[]> {
    try {
      return this.posts;
    } catch (error) {
      throw new HttpException(
        'This is a custom message',
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
  }

  findOne(id: number) {
    const post = this.posts.find((item) => +item.id === id);
    if (!post) {
      throw new NotFoundException(`Not found post with id: ${id}`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto): PostModel {
    try {
      const post = this.findOne(+id);

      const updatedPost: PostModel = {
        ...post,
        title: updatePostDto.title || '',
        content: updatePostDto.content || '',
        postImages: updatePostDto.images,
        meta: { ...post.meta, updatedAt: new Date().toLocaleDateString() },
      };
      this.posts = this.posts.map((item) => {
        return +item.id === id ? updatedPost : item;
      });
      return updatedPost;
    } catch (err) {
      throw new HttpException('Error updating post', HttpStatus.BAD_REQUEST, {
        cause: err,
      });
    }
  }

  remove(id: number) {
    try {
      const post = this.findOne(+id);
      if (post) {
        this.posts = this.posts.filter((item) => +item.id !== id);
      }
    } catch (err) {
      throw new NotFoundException('Error deleting post. Post not founded.', {
        cause: err,
      });
    }
  }
}
