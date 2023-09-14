import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@ValidatorConstraint({ name: 'IsEmailAvailable', async: true })
@Injectable()
export class IsEmailAvailable implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validate(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ email });
        return !user;
    }
    defaultMessage(): string {
        return 'The email «$value» is already register.';
    }
}
