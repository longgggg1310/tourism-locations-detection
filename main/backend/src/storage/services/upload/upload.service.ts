import fs, { PathLike } from 'fs';
import { Injectable } from '@nestjs/common';
import { FileAttributeStatusEnum } from 'src/storage/dto/file.dto';
import { Metadata, FileContent, MetadataFilter } from '../../model';
import { S3fsUploaderService } from '../../s3fs/s3fs-uploader/s3fs-uploader.service';
import { IUploader } from '../../interfaces/uploader.interface';
import { StorageService } from '../storage/storage.service';
import { File } from 'src/storage/entities/file.entity';

@Injectable()
export class UploadService implements IUploader {
    constructor(private readonly s3fsUploader: S3fsUploaderService, private readonly storageService: StorageService) {}

    async upload(metadata: Metadata, content: FileContent, ...metadataFilters: MetadataFilter[]): Promise<File> {
        const res = await this.uploadRaw(metadata, content, ...metadataFilters);

        const attribute = {
            ...metadata,
        };
        attribute['status'] = FileAttributeStatusEnum.DEFAULT;

        const file = await this.storageService.create({
            storage: metadata.storage,
            originalname: metadata.filename,
            filename: metadata.key,
            mimeType: metadata.contentType,
            attribute: JSON.parse(JSON.stringify(attribute)),
            cid: res?.uri || '',
            resizeThumbnail: '',
            smallThumbnail: '',
            size: metadata.size,
            cdnUrl: res?.cdnUrl || '',
        });

        return file;
    }

    async uploadRaw(metadata: Metadata, content: FileContent, ...metadataFilters: MetadataFilter[]): Promise<any> {
        switch (metadata.storage) {
            case 's3fs': {
                return this.s3fsUploader.upload(metadata, content as PathLike, ...metadataFilters);
            }
            default:
                throw new Error(`Storage ${metadata.storage} is not supported`);
        }
    }
}
