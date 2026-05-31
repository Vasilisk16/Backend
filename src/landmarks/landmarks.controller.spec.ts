import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LandmarksController } from './landmarks.controller';
import { LandmarksService } from './landmarks.service';

describe('LandmarksController', () => {
  let controller: LandmarksController;
  let service: jest.Mocked<LandmarksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandmarksController],
      providers: [
        {
          provide: LandmarksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(LandmarksController);
    service = module.get(LandmarksService);
  });

  it('should delegate findAll to service', async () => {
    const payload = { items: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    service.findAll.mockResolvedValue(payload);

    await expect(controller.findAll({ page: 1, limit: 12 })).resolves.toEqual(
      payload,
    );
  });

  it('should delegate findOne to service', async () => {
    const landmark = { slug: 'gostinye-dvory' };
    service.findOne.mockResolvedValue(landmark as never);

    await expect(controller.findOne('gostinye-dvory')).resolves.toEqual(
      landmark,
    );
  });
});
