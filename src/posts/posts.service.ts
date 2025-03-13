import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);

    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }

  private async checkExistingPost(id: string) {
    const post = await this.postsRepository.existsBy({ id });

    if (!post) {
      throw new NotFoundException(`Can't found post with id: ${id}`);
    }
    return true;
  }

  async findOne(id: string) {
    return this.postsRepository.findOneByOrFail({ id });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    const updatedPost = await this.postsRepository.preload({
      ...post,
      ...updatePostDto,
    });

    if (!updatedPost) {
      throw new NotFoundException(`Can't update post with id: ${id}`);
    }

    return this.postsRepository.save(updatedPost);
  }

  async remove(id: string) {
    await this.checkExistingPost(id);
    await this.postsRepository.delete(id);
  }
}
