import { Session, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport'
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, }));

  app.enableCors({
    origin: 'http://localhost:8080'
  });
  app.use(
    session({
      secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3042);

}
bootstrap();
