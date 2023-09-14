import { Injectable } from '@nestjs/common';
import { CreateFileDto } from '../../dto/create-file.dto';
import { UpdateFileDto } from '../../dto/update-file.dto';
import { FilesRepository } from 'src/storage/storage.repository';
import { File } from 'src/storage/entities/file.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    constructor(private filesRepository: FilesRepository, private config: ConfigService) {}

    buildCdnUrl(cid: string) {
        const fileKey = cid.split('/').pop()?.replace('"', '')?.replace('}', '');
        const cdnUrl = `https://${this.config.get('AWS_S3_BUCKET') || 'test112312'}.s3.${this.config.get(
            'AWS_S3_REGION',
        )}.amazonaws.com/${fileKey}`;

        console.log('s', cdnUrl);

        return cdnUrl;
    }

    getCdnUrl(file: File) {
        if (file.cdnUrl) {
            return file.cdnUrl;
        }
        if (!file.cid) {
            throw new Error('File cid is not defined');
        }

        return this.buildCdnUrl(file.cid);
    }

    normalizeCdnUrl(urlOrCid: string) {
        return urlOrCid.startsWith('http') ? urlOrCid : this.buildCdnUrl(urlOrCid);
    }

    async updateThumbnail(fileId: number, thumbnail: string, smallThumbnail: string) {
        const file = await this.filesRepository.findById(fileId);
        if (!file) {
            throw new Error('File not found');
        }
        file.resizeThumbnail = thumbnail;
        file.smallThumbnail = smallThumbnail;
        const savedFile = this.filesRepository.save(file);
        return savedFile;
    }

    async create(createFilesDto: Partial<File>) {
        return await this.filesRepository.createFile(createFilesDto);
    }

    async findAll() {
        return await this.filesRepository.findAll();
    }

    async findByCid(cid: string) {
        return await this.filesRepository.findByCid(cid);
    }
    async findByCdnUrl(cdnUrl: string) {
        return await this.filesRepository.findByCdnUrl(cdnUrl);
    }

    async findOne(id: number) {
        return await this.filesRepository.findById(+id);
    }

    async update(id: number, updateFilesDto: UpdateFileDto) {
        return await this.filesRepository.updateFile(+id, updateFilesDto);
    }

    async remove(id: number) {
        return await this.filesRepository.destroy(+id);
    }
}
