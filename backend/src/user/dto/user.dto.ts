import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { transformEmail } from 'src/utils/transformers/transformEmail';

export class UserDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    @Transform(transformEmail)
    email!: string;

    @ApiProperty()
    verify?: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
