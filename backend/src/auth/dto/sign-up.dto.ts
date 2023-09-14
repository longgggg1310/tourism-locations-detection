import { IsEmailAvailable } from './../../user/constraints/is-email-available.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose, Exclude } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsEmail, MinLength, IsOptional, Validate, ValidateIf, IsString } from 'class-validator';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class SignUp {
    @ApiProperty({ required: false, default: null })
    @IsNotEmpty()
    @IsString()
    @ValidateIf((dto) => !!dto.name)
    readonly name?: string = '';

    @ApiProperty({ required: false, default: null })
    @Validate(IsEmailAvailable)
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @ValidateIf((dto) => !!dto.email)
    @Transform(transformEmail)
    readonly email?: string = '';

    @ApiProperty({ required: false })
    @MinLength(8)
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    @ValidateIf((dto) => !!dto.password)
    readonly password?: string = '';
}
