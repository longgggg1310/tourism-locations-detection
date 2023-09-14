import { S3Module } from 'nestjs-s3';
import { Module } from '@nestjs/common';
import { S3fsUploaderService } from './s3fs-uploader/s3fs-uploader.service';

@Module({
    imports: [S3Module],
    providers: [S3fsUploaderService],
    exports: [S3fsUploaderService],
})
export class S3fsModule {}
