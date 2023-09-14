import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesRepository {
    constructor(
        @InjectRepository(File)
        private filesRepository: Repository<File>,
    ) {}

    public async findAll(): Promise<File[]> {
        return await this.filesRepository.find({});
    }

    public async findByCid(cid: string): Promise<File | undefined> {
        return await this.filesRepository.findOne({ where: { cid }, order: { id: 'ASC' } });
    }
    public async findByCdnUrl(cdnUrl: string): Promise<File | undefined> {
        return await this.filesRepository.findOne({ where: { cdnUrl }, order: { id: 'ASC' } });
    }

    public async findById(id: number): Promise<File | undefined> {
        return await this.filesRepository.findOne(id);
    }

    public async createFile(createFileDto: CreateFileDto): Promise<File> {
        console.log('090', createFileDto);

        const date = new Date().toISOString();
        if (!createFileDto.cid) {
            throw new BadRequestException(`No cid found`);
        }
        const file = await this.findByCid(createFileDto.cid);
        if (file) {
            return this.filesRepository.save({ ...file, ...createFileDto, createdAt: date });
        } else {
            return this.filesRepository.save({ ...createFileDto, createdAt: date });
        }
    }

    public async updateFile(id: number, updateFileDto: Partial<File>) {
        const file = await this.filesRepository.findOne(id);
        if (!file) {
            throw new BadRequestException(`No file found with id ${id}`);
        }
        return await this.filesRepository.update(id, updateFileDto);
    }

    public async destroy(id: number): Promise<void> {
        const file = await this.filesRepository.findOne(id);
        if (!file) {
            throw new BadRequestException(`No file found with id ${id}`);
        }
        await this.filesRepository.remove(file);
    }

    public async save(file: File): Promise<File> {
        return this.filesRepository.save(file);
    }
}
