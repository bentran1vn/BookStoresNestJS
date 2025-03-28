import { Test, TestingModule } from '@nestjs/testing';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

const mockBook = {
  _id: 'a_mock_id',
  title: 'Harry Potter and the Chamber of Secrets',
  author: 'J.K. Rowling',
  description: 'The second book in the Harry Potter series',
  price: 24.99,
};

describe('BooksResolver', () => {
  let resolver: BooksResolver;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksResolver,
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<BooksResolver>(BooksResolver);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('books', () => {
    it('should return an array of books', async () => {
      const findAll = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockBook]);
      expect(await resolver.books()).toEqual([mockBook]);
      expect(findAll).toHaveBeenCalled();
    });
  });

  describe('book', () => {
    it('should return a single book', async () => {
      const findOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockBook);
      expect(await resolver.book('a_mock_id')).toEqual(mockBook);
      expect(findOne).toHaveBeenCalledWith('a_mock_id');
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const createBookInput = {
        title: mockBook.title,
        author: mockBook.author,
        description: mockBook.description,
        price: mockBook.price,
      };
      const create = jest.spyOn(service, 'create').mockResolvedValue(mockBook);
      expect(await resolver.createBook(createBookInput)).toEqual(mockBook);
      expect(create).toHaveBeenCalledWith(createBookInput);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updateBookInput = { price: 19.99 };
      const updatedBook = { ...mockBook, price: 19.99 };
      const update = jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedBook);
      expect(await resolver.updateBook('a_mock_id', updateBookInput)).toEqual(
        updatedBook,
      );
      expect(update).toHaveBeenCalledWith('a_mock_id', updateBookInput);
    });
  });

  describe('deleteBook', () => {
    it('should return true when book is deleted', async () => {
      const remove = jest.spyOn(service, 'remove').mockResolvedValue(true);
      expect(await resolver.deleteBook('a_mock_id')).toBe(true);
      expect(remove).toHaveBeenCalledWith('a_mock_id');
    });
  });
});
