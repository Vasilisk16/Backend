import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADMIN_ADAPTER,
  AdminModule,
} from 'nestjs-dj-admin';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AdminProvidersModule } from './admin/admin.module.js';
import { createResilientTypeOrmAdminAdapter } from './admin/resilient-typeorm-admin.adapter.js';
import { AppController } from './app.controller.js';
import { LandmarksModule } from './landmarks/landmarks.module.js';
import { ReferencesModule } from './references/references.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const caPath = path.join(process.cwd(), 'ca.pem');
        const rejectUnauthorized =
          configService.get<string>('POSTGRES_SSL_REJECT_UNAUTHORIZED') ===
          'true';
        const sslConfig =
          rejectUnauthorized && fs.existsSync(caPath)
            ? {
                rejectUnauthorized: true,
                ca: fs.readFileSync(caPath).toString(),
              }
            : { rejectUnauthorized: false };

        const poolMax = Math.min(
          Math.max(
            Number(configService.get<string>('POSTGRES_POOL_MAX') ?? 5),
            1,
          ),
          20,
        );

        return {
          type: 'postgres' as const,
          host: configService.get<string>('POSTGRES_HOST'),
          port: Number(configService.get<string>('POSTGRES_PORT')),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DATABASE'),
          autoLoadEntities: true,
          synchronize: false,
          ssl: sslConfig,
          poolSize: poolMax,
          extra: {
            max: poolMax,
            min: 0,
            idleTimeoutMillis: 20000,
            connectionTimeoutMillis: 30000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
            maxUses: 500,
            ssl: sslConfig,
          },
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
    AdminModule.forRoot({
      path: '/admin',
      branding: {
        siteHeader: 'Архангельск — наследие',
        siteTitle: 'Админ-панель',
      },
      auth: {
        mode: 'session',
        authenticate: async ({ email, password }) => {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (email === adminEmail && password === adminPassword) {
            return {
              id: '1',
              email,
              isSuperuser: true,
              permissions: ['*'],
            };
          }

          return null;
        },
      },
    }),
    AdminProvidersModule,
    LandmarksModule,
    ReferencesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: ADMIN_ADAPTER,
      useFactory: (dataSource: DataSource) =>
        createResilientTypeOrmAdminAdapter(dataSource),
      inject: [DataSource],
    },
  ],
})
export class AppModule {}
