import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

enum StorageDtoEnum {
    ipfs = 'ipfs',
    s3fs = 's3fs',
}
export class UploadDto {
    @ApiProperty({
        enum: ['test112312'],
        default: 'test112312',
    })
    @IsNotEmpty()
    bucket?: string;

    @ApiProperty({
        enum: StorageDtoEnum,
        example: 'ipfs',
    })
    @IsNotEmpty()
    storage!: 'ipfs' | 's3fs';

    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    file?: ExpMulter.File;

    @ApiProperty({ required: false, default: '200' })
    @IsOptional()
    widthThumbnail?: string;

    @ApiProperty({ required: false, default: '200' })
    @IsOptional()
    heightThumbnail?: string;
}
