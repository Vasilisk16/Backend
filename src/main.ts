import { ConsoleLogger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync } from 'fs';
import express from 'express';
import helmet from 'helmet';
import { join, resolve } from 'path';
import { AppModule } from './app.module.js';

function mountAdminUi(app: Awaited<ReturnType<typeof NestFactory.create>>) {
  const adminUiDist = resolve(
    process.cwd(),
    'node_modules/nestjs-dj-admin/dist/admin-ui',
  );

  if (!existsSync(join(adminUiDist, 'index.html'))) {
    return;
  }

  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.use(
    '/admin',
    express.static(adminUiDist, { index: 'index.html', redirect: false }),
  );
  httpServer.get('/admin', (_req: express.Request, res: express.Response) => {
    res.sendFile(join(adminUiDist, 'index.html'));
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'HeritageOfArh',
      compact: true,
    }),
  });

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'admin', method: RequestMethod.ALL },
      { path: 'admin/(.*)', method: RequestMethod.ALL },
    ],
  });
  mountAdminUi(app);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Heritage of Arkhangelsk API')
    .setDescription('API каталога достопримечательностей Архангельской области')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
  });
}

bootstrap();
