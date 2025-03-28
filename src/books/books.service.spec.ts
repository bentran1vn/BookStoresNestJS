import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './entities/book.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockBook = {
  _id: 'a_mock_id',
  title: 'Harry Potter and the Chamber of Secrets',
  author: 'J.K. Rowling',
  description: 'The second book in the Harry Potter series',
  price: 24.99,
};

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<Book>;

  const mockBookModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [mockBook];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as any);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);

      expect(await service.findOne('a_mock_id')).toBe(mockBook);
    });

    it('should throw an error if book is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('wrong_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: mockBook.title,
        author: mockBook.author,
        description: mockBook.description,
        price: mockBook.price,
      };

      jest.spyOn(model, 'create').mockResolvedValueOnce(mockBook as any);

      expect(await service.create(createBookDto)).toBe(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = { price: 19.99 };
      const updatedBook = { ...mockBook, price: 19.99 };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedBook),
      } as any);

      expect(await service.update('a_mock_id', updateBookDto)).toBe(
        updatedBook,
      );
    });

    it('should throw an error if book to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.update('wrong_id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should return true when book is deleted', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);

      expect(await service.remove('a_mock_id')).toBe(true);
    });

    it('should throw an error if book to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.remove('wrong_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
