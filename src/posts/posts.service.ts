import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private postsRepository: Repository<PostModel>,
  ) {}

  create(createPostDto: CreatePostDto): Promise<PostModel> {
    const post = this.postsRepository.create(createPostDto);

    return this.postsRepository.save(post);
  }

  findAll(): Promise<PostModel[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<PostModel | null> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Not found post with id: ${id}`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostModel> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException(`Not found post with id: ${id}`);
    }

    const updatedPost = { ...post, ...updatePostDto };
    return this.postsRepository.save(updatedPost);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException(`Can't delete post with id: ${id}`);
    }

    await this.postsRepository.delete(id);
  }
}
