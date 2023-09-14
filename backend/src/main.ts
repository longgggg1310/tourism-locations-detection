import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import compression from 'compression';
import { setupAuth } from './setup-auth';
import { ClassSerializerInterceptor, HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(compression());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );
    setupAuth(app);

    if (process.env.API_DOCS) {
        setupSwagger(app);
    }
    const httpAdapter = app.getHttpAdapter();
    const server = httpAdapter.getHttpServer();
    server.keepAliveTimeout = 120000;

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
}
bootstrap();
