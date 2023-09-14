// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { HealthController } from './health.controller';
import { join } from 'path';
import { TerminusModule } from '@nestjs/terminus';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from './mail/mail.module';
import filesystem from './storage/filesystem';
import { ProductModule } from './products/product.module';
import { StorageModule } from './storage/storage.module';
import { S3Module } from 'nestjs-s3';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [filesystem],
        }), // Import and configure ConfigModule
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),

        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: Number(configService.get('REDIS_PORT')),
                },
            }),
            inject: [ConfigService],
        }),
        S3Module.forRootAsync({
            useFactory: (config: ConfigService) => ({
                config: {
                    accessKeyId: config.get('AWS_S3_KEY'),
                    secretAccessKey: config.get('AWS_S3_SECRET'),
                    region: config.get('AWS_S3_REGION'),
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                },
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        RedisHealthModule,
        TerminusModule,
        DatabaseModule,
        MailModule,
        StorageModule,
        UserModule,
        ProductModule,
        AuthModule,
    ],
    controllers: [AppController, HealthController],
    providers: [AppService],
})
export class AppModule {}
