import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query(() => Book)
  async book(@Args('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  async createBook(
    @Args('input') createBookInput: CreateBookInput,
  ): Promise<Book> {
    return this.booksService.create(createBookInput);
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id') id: string,
    @Args('input') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookInput);
  }

  @Mutation(() => Boolean)
  async deleteBook(@Args('id') id: string): Promise<boolean> {
    return this.booksService.remove(id);
  }
}
