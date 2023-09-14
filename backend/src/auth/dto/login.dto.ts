import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    password!: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(transformEmail)
    email!: string;
}

export class LoginAsAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform(transformEmail)
    email!: string;
}
