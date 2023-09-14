import { Body, Controller, ForbiddenException, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileDto } from 'src/storage/dto/file.dto';
import { Metadata } from '../../model';
import { UploadDto } from './../../dto/upload.dto';
import { UploadService } from './../../services/upload/upload.service';

@ApiTags('Storage')
// @UseGuards(Web3AuthGuard)
@Controller('storage')
export class UploadController {
    constructor(private readonly uploader: UploadService) {}

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadDto })
    @UseInterceptors(FileInterceptor('file'))
    @ApiCreatedResponse({
        description: 'FileDto',
        type: FileDto,
    })
    async upload(
        @Body() body: UploadDto,
        // @ts-ignore
        @UploadedFile() file: ExpMulter.File,
    ): Promise<FileDto> {
        const metadata: Metadata = {
            storage: body.storage,
            bucket: body.bucket,
            filename: file.originalname,
            contentType: file.mimetype,
            size: `${file.size}`,
            key: file.filename,
            id: '',
            path: `/${body.bucket}/${file.filename}`,
            widthThumbnail: body.widthThumbnail ?? '200',
            heightThumbnail: body.heightThumbnail ?? '200',
        };
        return await this.uploader.upload(metadata, file.path);
    }
}
