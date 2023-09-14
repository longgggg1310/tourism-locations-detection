import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export enum FileAttributeStatusEnum {
    DEFAULT = 'DEFAULT',
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED',
    DONE = 'DONE',
}

export class FileDto {
    @ApiProperty()
    @IsNotEmpty()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    cid?: string;

    @ApiProperty()
    @IsNotEmpty()
    cdnUrl?: string;

    @ApiProperty()
    @IsNotEmpty()
    storage?: string;

    @ApiProperty()
    @IsNotEmpty()
    originalname?: string;

    @ApiProperty()
    @IsNotEmpty()
    filename?: string;

    @ApiProperty()
    @IsNotEmpty()
    mimeType?: string;

    @ApiProperty()
    @IsNotEmpty()
    size?: string;

    @ApiProperty({
        type: 'object',
    })
    @IsOptional()
    attribute?: Object;

    @ApiProperty()
    @IsNotEmpty()
    createdAt?: Date;
}
