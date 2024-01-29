import { PrismaHelper } from '../prisma.helper';

describe('PrismaHelper', () => {
  let prismaHelper: PrismaHelper;

  beforeEach(() => {
    prismaHelper = new PrismaHelper();
  });

  describe('onModuleInit', () => {
    it('should connect to Prisma successfully', async () => {
      jest.spyOn(prismaHelper, '$connect').mockResolvedValueOnce();

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await prismaHelper.onModuleInit();

      expect(consoleLogSpy).toHaveBeenCalledWith('success');
      expect(prismaHelper.$connect).toHaveBeenCalled();
    });

    it('should log error if connection fails', async () => {
      const mockError = new Error('Mock connection error');
      jest.spyOn(prismaHelper, '$connect').mockRejectedValueOnce(mockError);

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await prismaHelper.onModuleInit();

      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(prismaHelper.$connect).toHaveBeenCalled();
    });
  });
});
