import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';

export function setupSwagger(app: INestApplication): INestApplication {
    const config = new DocumentBuilder()
        .setTitle('Test API')
        .setDescription('Busker API description')
        .setVersion('1.0')
        .addBearerAuth(undefined, 'defaultToken')
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            controllerKey ? `${methodKey}${controllerKey.replace('Controller', '')}` : methodKey,
    });

    if (process.env.NODE_ENV === 'development') {
        fs.writeFileSync('./swagger.json', JSON.stringify(document));
    }

    SwaggerModule.setup('swagger', app, document);
    return app;
}
