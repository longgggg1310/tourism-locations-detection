import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { S3fsModule } from './s3fs/s3fs.module';
import { HttpModule } from '@nestjs/axios';

import { StorageService } from './services/storage/storage.service';
import { UploadService } from './services/upload/upload.service';
import { UploadController } from './controllers/upload/upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FilesRepository } from './storage.repository';
import { BullModule } from '@nestjs/bull';
import { StorageController } from './controllers/storage/storage.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        MulterModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    dest: config.get('STORAGE_LOCAL_DIR'),
                };
            },
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        S3fsModule,
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000000000,
                maxRedirects: 5,
            }),
        }),
    ],
    controllers: [StorageController, UploadController],
    providers: [StorageService, UploadService, FilesRepository],
    exports: [StorageService, S3fsModule, UploadService, FilesRepository],
})
export class StorageModule {}
