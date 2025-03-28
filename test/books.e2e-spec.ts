import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { Book } from '../src/books/entities/book.entity';
import { getModelToken } from '@nestjs/mongoose';

interface GraphQLResponse<T> {
  data: T;
}

interface CreateBookResponse {
  createBook: Book;
}

interface BooksResponse {
  books: Book[];
}

interface BookResponse {
  book: Book;
}

interface DeleteBookResponse {
  deleteBook: boolean;
}

interface UpdateBookResponse {
  updateBook: Book;
}

describe('BooksResolver (e2e)', () => {
  let app: INestApplication;
  let bookModel: Model<Book>;
  let createdBookId: string;

  const mockBook = {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    description: 'The second book in the Harry Potter series',
    price: 24.99,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bookModel = moduleFixture.get<Model<Book>>(getModelToken(Book.name));
    await app.init();
  });

  afterAll(async () => {
    await bookModel.deleteMany({}).exec();
    await app.close();
  });

  describe('createBook', () => {
    it('should create a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createBook(input: {
                title: "${mockBook.title}",
                author: "${mockBook.author}",
                description: "${mockBook.description}",
                price: ${mockBook.price}
              }) {
                _id
                title
                author
                description
                price
              }
            }
          `,
        });

      const { data } = response.body as GraphQLResponse<CreateBookResponse>;
      expect(response.status).toBe(200);
      expect(data.createBook).toMatchObject(mockBook);
      expect(data.createBook._id).toBeDefined();
      createdBookId = data.createBook._id;
    });
  });

  describe('books', () => {
    it('should return an array of books', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            {
              books {
                _id
                title
                author
                description
                price
              }
            }
          `,
        });

      const { data } = response.body as GraphQLResponse<BooksResponse>;
      expect(response.status).toBe(200);
      expect(Array.isArray(data.books)).toBe(true);
      expect(data.books.length).toBeGreaterThan(0);

      const createdBook = data.books.find((book) => book._id === createdBookId);
      expect(createdBook).toBeDefined();
      expect(createdBook).toMatchObject(mockBook);
    });
  });

  describe('book', () => {
    it('should return a single book', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            {
              book(id: "${createdBookId}") {
                _id
                title
                author
                description
                price
              }
            }
          `,
        });

      const { data } = response.body as GraphQLResponse<BookResponse>;
      expect(response.status).toBe(200);
      expect(data.book).toMatchObject(mockBook);
      expect(data.book._id).toBe(createdBookId);
    });
  });

  describe('updateBook', () => {
    const updatedPrice = 19.99;

    it('should update a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              updateBook(id: "${createdBookId}", input: { price: ${updatedPrice} }) {
                _id
                title
                author
                description
                price
              }
            }
          `,
        });

      const { data } = response.body as GraphQLResponse<UpdateBookResponse>;
      expect(response.status).toBe(200);
      expect(data.updateBook).toMatchObject({
        ...mockBook,
        price: updatedPrice,
      });
      expect(data.updateBook._id).toBe(createdBookId);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              deleteBook(id: "${createdBookId}")
            }
          `,
        });

      const { data } = response.body as GraphQLResponse<DeleteBookResponse>;
      expect(response.status).toBe(200);
      expect(data.deleteBook).toBe(true);
    });
  });
});
