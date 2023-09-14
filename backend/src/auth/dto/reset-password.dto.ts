import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    password!: string;

    @ApiProperty()
    @IsNotEmpty()
    token!: string;
}

export class ForgotPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform(transformEmail)
    email!: string;
}
