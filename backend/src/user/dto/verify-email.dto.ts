import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class VerifyEmailDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform(transformEmail)
    email!: string;
}
