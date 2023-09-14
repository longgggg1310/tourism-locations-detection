import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FileDto } from 'src/storage/dto/file.dto';
import { transformEmail } from 'src/utils/transformers/transformEmail';
import { UserTypeEnum } from '../services/user.service';
import { UserRoleEnum } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';

export class FullUserDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    @Transform(transformEmail)
    email!: string;

    @ApiProperty()
    verify?: string;

    @ApiProperty({
        enum: UserTypeEnum,
    })
    type?: UserTypeEnum;

    @ApiProperty({
        enum: UserRoleEnum,
    })
    role?: UserRoleEnum;

    @ApiProperty()
    nonce!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
