import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import * as session from 'express-session';
import * as passport from 'passport'
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors();
  app.use(
    session({
      secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(passport.session());
  await app.listen(3042);

}
bootstrap();
