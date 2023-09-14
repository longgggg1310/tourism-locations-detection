import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileDto {
    @ApiProperty()
    @IsNotEmpty()
    cid?: string;

    @ApiProperty()
    @IsNotEmpty()
    storage?: string;

    @ApiProperty()
    @IsNotEmpty()
    originalname?: string;

    @ApiProperty()
    @IsOptional()
    duration?: number;

    @ApiProperty()
    @IsNotEmpty()
    filename?: string;

    @ApiProperty()
    @IsNotEmpty()
    mimeType?: string;

    @ApiProperty()
    @IsNotEmpty()
    size?: string;

    @ApiProperty()
    @IsOptional()
    attribute?: JSON;
}
