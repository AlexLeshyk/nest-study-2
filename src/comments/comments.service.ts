import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  private async checkExistingPost(id: string) {
    const post = await this.postsRepository.existsBy({ id });
    if (!post) {
      throw new NotFoundException(`Can't found post with id: ${id}`);
    }
  }

  async create(postId: string, createCommentDto: CreateCommentDto) {
    await this.checkExistingPost(postId);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
    });
    return this.commentsRepository.save(comment);
  }

  async findAll(postId: string) {
    await this.checkExistingPost(postId);

    return this.commentsRepository.findBy({ postId });
  }

  async findOne(id: string, postId: string) {
    await this.checkExistingPost(postId);
    return this.commentsRepository.findOneByOrFail({ id });
  }

  async update(id: string, postId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id, postId);

    const updatedComment = await this.commentsRepository.preload({
      ...comment,
      ...updateCommentDto,
    });

    if (!updatedComment) {
      throw new NotFoundException(`Can't update comment with id: ${id}`);
    }

    return this.commentsRepository.save(updatedComment);
  }

  async remove(id: string, postId: string) {
    const comment = await this.findOne(id, postId);
    await this.commentsRepository.remove(comment);
  }
}
