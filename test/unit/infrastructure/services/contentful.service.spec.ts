import { ContentfulService } from '../../../../src/infrastructure/services/contentful.service';
import { createMockLogger } from '../../../mocks/logger.mock';
import { mockContentfulProducts } from '../../../../src/data/dataFakeContentFul';
import { DomainError } from '../../../../src/domain/exceptions/domain.error';
import { DomainErrorBR } from '../../../../src/domain/enums/domain.error.enum';

jest.mock('contentful', () => ({
  createClient: jest.fn(() => ({
    getEntries: jest.fn(),
  })),
}));

describe('ContentfulService', () => {
  let service: ContentfulService;
  let logger: ReturnType<typeof createMockLogger>;
  let clientMock: { getEntries: jest.Mock };

  beforeEach(() => {
    logger = createMockLogger();
    service = new ContentfulService(logger);
    clientMock = (service as any).client as { getEntries: jest.Mock };
    (service as any).useMock = true;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return mock products when useMock is true', async () => {
      const result = await service.getAllProducts();
      const spyLog = jest.spyOn(logger, 'log');

      expect(result).toEqual(mockContentfulProducts);
      expect(spyLog).toHaveBeenCalledWith('Using mock data for getAllProducts');
    });

    it('should fetch products from Contentful when useMock is false', async () => {
      (service as any).useMock = false;
      clientMock.getEntries.mockResolvedValue({
        items: mockContentfulProducts,
      });
      const result = await service.getAllProducts();
      expect(clientMock.getEntries).toHaveBeenCalledWith({
        content_type: expect.any(String),
        limit: 1000,
      });
      expect(result).toEqual(mockContentfulProducts);
    });

    it('should throw DomainError if fetch fails', async () => {
      const spyError = jest.spyOn(logger, 'error');

      (service as any).useMock = false;
      clientMock.getEntries.mockRejectedValue(new Error('fail'));

      await expect(service.getAllProducts()).rejects.toThrow(DomainError);
      expect(spyError).toHaveBeenCalledWith(
        'Failed to fetch products from Contentful',
        expect.any(String),
      );
    });
  });

  describe('getProductsUpdatedSince', () => {
    it('should return mock products when useMock is true', async () => {
      const spyLog = jest.spyOn(logger, 'log');

      const result = await service.getProductsUpdatedSince(new Date());
      expect(result).toEqual(mockContentfulProducts);
      expect(spyLog).toHaveBeenCalledWith(
        'Using mock data for getProductsUpdatedSince',
      );
    });

    it('should fetch updated products from Contentful when useMock is false', async () => {
      (service as any).useMock = false;
      clientMock.getEntries.mockResolvedValue({
        items: mockContentfulProducts,
      });
      const date = new Date('2024-11-16T10:00:00.000Z');
      const result = await service.getProductsUpdatedSince(date);
      expect(clientMock.getEntries).toHaveBeenCalledWith({
        content_type: expect.any(String),
        limit: 1000,
        'sys.updatedAt[gte]': date.toISOString(),
      });
      expect(result).toEqual(mockContentfulProducts);
    });

    it('should throw DomainError if fetch fails', async () => {
      const spyError = jest.spyOn(logger, 'error');

      (service as any).useMock = false;
      clientMock.getEntries.mockRejectedValue(new Error('fail'));
      await expect(service.getProductsUpdatedSince(new Date())).rejects.toThrow(
        DomainError,
      );
      expect(spyError).toHaveBeenCalledWith(
        'Failed to fetch updated products from Contentful',
        expect.any(String),
      );
    });
  });
});
