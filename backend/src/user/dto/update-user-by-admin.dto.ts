import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, ValidateIf } from 'class-validator';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class UpdateUserByAdmin {
    @ApiProperty({ required: false })
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false, default: null })
    @IsOptional()
    @IsEmail()
    @ValidateIf((dto) => !!dto.email)
    @Transform(transformEmail)
    email?: string;
}
