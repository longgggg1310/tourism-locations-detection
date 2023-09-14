import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';
import { customAlphabet, nanoid, urlAlphabet } from 'nanoid';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailJobData } from 'src/mail/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async register(signUp: Partial<User>): Promise<User> {
        const user = await this.userService.create(signUp);
        if (!signUp.email) {
            throw new BadRequestException('email is missing from request');
        }
        if (signUp.email) {
            await this.userService.sendMailSignUp(signUp.email, user.id);
        }
        return user;
    }

    async login(email: string, password: string): Promise<User> {
        let user: User;
        try {
            user = await this.userService.findOne({ where: { email } });
        } catch (err) {
            throw new UnauthorizedException(`There isn't any user with email: ${email}`);
        }

        if (!(await user.checkPassword(password))) {
            throw new UnauthorizedException(`Wrong password for user with email: ${email}`);
        }

        delete user.password;
        return user;
    }
    async verifyPayload(payload: JwtPayload): Promise<User> {
        let { user } = payload;

        try {
            if (!user.email) {
                throw new BadRequestException('Email or Wallet address not found');
            }
            const condition = { email: user.email };
            user = await this.userService.findOne({
                where: condition,
            });
            delete user.password;
            return user;
        } catch (error) {
            throw new UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
        }
    }
    signToken(user: User): string {
        const payload = { user };
        return this.jwtService.sign(payload);
    }

    async forgotPassword({ email }: { email: string }) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException(`There isn't any account with email: ${email}`);
        }
        const lastPasswordResetRequest = new Date();
        await this.userService.checkResetPassword(user.id, lastPasswordResetRequest);

        await this.userService.sendMailResetPassword(email, user.id);
        return user;
    }

    async resetPassword(newPassword: string, token: string) {
        return await this.userService.resetPassword(newPassword, token);
    }
}
