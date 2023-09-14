import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { InjectS3 } from 'nestjs-s3';
import fs, { PathLike } from 'fs';
import { Metadata, MetadataFilter, metadataPath } from '../../model/metadata';
import { IUploader } from '../../interfaces/uploader.interface';
import * as AWS from 'aws-sdk';
import stream from 'stream';

@Injectable()
export class S3fsUploaderService implements IUploader {
    private readonly logger = new Logger(S3fsUploaderService.name);

    constructor(@InjectS3() private readonly s3: AWS.S3, private readonly config: ConfigService) {}

    // upload the given content stream/buffer
    // metadata will be processed after the content was added to storage
    async upload(metadata: Metadata, content: PathLike, ...metadataFilters: MetadataFilter[]): Promise<any> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: metadata.bucket || 'test112312',
            Key: metadata.key || '',
            Metadata: metadata as any,
            ACL: 'public-read',
        };

        if (metadata.contentType) {
            params.ContentType = metadata.contentType;
        }

        const { writeStream, promise } = this.uploadStream(params);

        let readStream;
        if (typeof content['pipe'] === 'function') {
            readStream = content;
        } else {
            readStream = fs.createReadStream(content);
            readStream.pipe(writeStream);
        }
        const extensionFile = await this.getExtensionFile(metadata);
        const cdnUrl = `https://${metadata.bucket || 'test112312'}.s3.${this.config.get(
            'AWS_S3_REGION',
        )}.amazonaws.com/${extensionFile}`;

        console.log('99', cdnUrl);

        const result = await promise;
        const uri = this.getFileUri(result);
        return { uri, cdnUrl };
    }

    private getFileUri(result: AWS.S3.ManagedUpload.SendData): string {
        return result.Location.replace('https://', 's3fs://');
    }

    private uploadStream(params: AWS.S3.PutObjectRequest) {
        const pass = new stream.PassThrough();
        return {
            writeStream: pass,
            promise: this.s3.upload({ ...params, Body: pass }).promise(),
        };
    }

    private getExtensionFile(metadata: Metadata) {
        const extension = metadata.contentType.split('/')[0];
        const keyName = metadata.key?.split('.')[1];
        if (extension == 'audio' && !keyName) {
            return `${metadata.key}.mp3`;
        }
        return metadata.key;
    }
}
