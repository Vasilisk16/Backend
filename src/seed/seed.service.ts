import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from '../landmarks/landmark.entity.js';
import { Architect } from '../references/entities/architect.entity.js';
import { Category } from '../references/entities/category.entity.js';
import { Era } from '../references/entities/era.entity.js';
import { LegalStatus } from '../references/entities/legal-status.entity.js';
import { Purpose } from '../references/entities/purpose.entity.js';
import { Style } from '../references/entities/style.entity.js';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Era)
    private readonly eraRepository: Repository<Era>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Style)
    private readonly styleRepository: Repository<Style>,
    @InjectRepository(Architect)
    private readonly architectRepository: Repository<Architect>,
    @InjectRepository(Purpose)
    private readonly purposeRepository: Repository<Purpose>,
    @InjectRepository(LegalStatus)
    private readonly legalStatusRepository: Repository<LegalStatus>,
    @InjectRepository(Landmark)
    private readonly landmarkRepository: Repository<Landmark>,
  ) {}

  async onModuleInit() {
    const count = await this.landmarkRepository.count();
    if (count > 0) {
      return;
    }

    this.logger.log('Seeding initial data...');

    const eras = await this.eraRepository.save([
      { name: 'XVII век', sortOrder: 1 },
      { name: 'XVIII век', sortOrder: 2 },
      { name: 'XIX век', sortOrder: 3 },
      { name: 'XX век', sortOrder: 4 },
    ]);

    const categories = await this.categoryRepository.save([
      { name: 'Деревянное зодчество', slug: 'wooden' },
      { name: 'Культовые', slug: 'religious' },
      { name: 'Гражданские', slug: 'civil' },
      { name: 'Торговля', slug: 'trade' },
    ]);

    const styles = await this.styleRepository.save([
      { name: 'Московское барокко' },
      { name: 'Русское барокко' },
      { name: 'Классицизм' },
    ]);

    const architects = await this.architectRepository.save([
      { name: 'Г. Миндер' },
    ]);

    const purposes = await this.purposeRepository.save([
      { name: 'Музей' },
      { name: 'Культовое' },
      { name: 'Купеческое' },
      { name: 'Торговля' },
    ]);

    const legalStatuses = await this.legalStatusRepository.save([
      { name: 'Федеральный ОКН' },
      { name: 'Региональный ОКН' },
    ]);

    await this.landmarkRepository.save([
      {
        slug: 'gostinye-dvory',
        title: 'Гостиные дворы',
        subtitle: 'Бывшие Русский и Немецкий гостиные дворы',
        shortDescription:
          'Один из старейших торговых комплексов города на набережной Северной Двины.',
        fullDescription:
          'Гостиные дворы — уникальный памятник московского барокко XVII века, построенный по указу Петра I. Комплекс долгое время был центром торговли и купеческой жизни Архангельска. Сегодня здесь размещается музей, сохранивший атмосферу исторического торгового двора.',
        yearOfConstruction: '1684 г.',
        address: 'Набережная СД, 85',
        imageUrl: 'https://placehold.co/800x600?text=Gostinye+Dvory',
        era: eras[0],
        style: styles[0],
        architect: architects[0],
        purpose: purposes[0],
        legalStatus: legalStatuses[0],
        categories: [categories[2], categories[3]],
      },
      {
        slug: 'antonievo-siysky-monastery',
        title: 'Свято-Троицкий Антониево-Сийский монастырь',
        subtitle: 'Действующий монастырь',
        shortDescription:
          'Один из крупнейших монастырских комплексов Русского Севера XVIII века.',
        fullDescription:
          'Антониево-Сийский монастырь был основан в XVI веке и получил значительное каменное строительство в XVIII веке. Архитектурный ансамбль сочетает традиции русского барокко и монастырской планировки. Монастырь сохраняет культовое назначение и является важным духовным центром региона.',
        yearOfConstruction: 'XVIII в.',
        address: 'Архангельская область, с. Холмогоры',
        imageUrl: 'https://placehold.co/800x600?text=Antonievo-Siysky',
        era: eras[1],
        style: styles[1],
        architect: null,
        purpose: purposes[1],
        legalStatus: legalStatuses[0],
        categories: [categories[1]],
      },
      {
        slug: 'plotnikova-mansion',
        title: 'Особняк Е.К. Плотниковой',
        subtitle: 'Гражданская архитектура XIX века',
        shortDescription:
          'Каменный особняк купеческой семьи в стиле классицизма.',
        fullDescription:
          'Особняк Е.К. Плотниковой отражает купеческую культуру Архангельска XIX века. Здание выполнено в строгих формах классицизма с характерной для города каменной кладкой. Памятник демонстрирует эволюцию городской застройки от торговых дворов к частным городским резиденциям.',
        yearOfConstruction: 'XIX в.',
        address: 'г. Архангельск, ул. Садовая',
        imageUrl: 'https://placehold.co/800x600?text=Plotnikova+Mansion',
        era: eras[2],
        style: styles[2],
        architect: null,
        purpose: purposes[2],
        legalStatus: legalStatuses[1],
        categories: [categories[2]],
      },
    ]);

    this.logger.log('Seed completed');
  }
}
