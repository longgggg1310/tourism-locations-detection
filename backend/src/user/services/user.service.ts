import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserByAdmin } from '../dto/update-user-by-admin.dto';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailJobData } from 'src/mail/interfaces';
import { log } from 'console';
import * as bcrypt from 'bcrypt';

export enum UserTypeEnum {
    FAN_ONLY = 'FAN_ONLY',
    MUSICIAN = 'MUSICIAN',
    ADMIN = 'ADMIN',
}
type UserDefaultSettingType = {
    userId: number;
    // userType: UserTypeEnum;
};

// migreate xem
@Injectable()
export class UserService {
    constructor(
        // loi type
        // loi cho nay sua met day, config sai dau do r
        @InjectRepository(User) // Make sure the decorator is applied here
        private readonly userRepository: Repository<User>,
        @InjectQueue('user-default-setting')
        private readonly defaultUserSettingQueue: Queue<UserDefaultSettingType>,
        @InjectQueue('send-email')
        private readonly sendMailVerifyQueue: Queue<SendEmailJobData>,
    ) {}
    async getUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`No user found with id ${id}`);
        }
        return user;
    }

    async updateUser(id: number, updateUserByAdmin: Partial<User>) {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new BadRequestException(`No user found with id ${id}`);
        }
        return await this.userRepository.update(id, updateUserByAdmin);
    }
    async updateUserInviting(userId: number, updateInfo: UpdateUserByAdmin): Promise<User> {
        let user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new BadRequestException(`No musician inviting found with id ${userId}`);
        }

        let userData: Partial<User> = {
            ...updateInfo,
        };

        // When receive a new email the token will change and resend email
        if (userData.email?.trim() && userData.email !== user.email) {
            const isEmailExist = await this.checkEmailExist(userData.email || '');
            if (isEmailExist) {
                throw new BadRequestException('The email already exist!');
            }
            const newToken = this.getRandomToken();
            userData.token = newToken;
            await this.sendMailInvitation(userData.email || '', userId, newToken);
        }
        const updatedUser = this.userRepository.merge(user, userData);
        const savedUser = await this.userRepository.save(updatedUser);
        return savedUser;
    }
    async checkEmailExist(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            return false;
        }
        return true;
    }

    getRandomToken(): string {
        return randomUUID();
    }

    async sendMailInvitation(email: string, userId: number, token: string) {
        try {
            if (!email) {
                throw new BadRequestException('email not found');
            }
            const findUser = await this.findOne({ where: { id: userId }, select: ['name'] });
            if (!findUser) {
                throw new NotFoundException('User not found!');
            }
            // this.sendMailVerifyQueue.add({
            //     emailType: 'INVITATION_MAIL',
            //     email: email,
            //     params: {
            //         token: token,
            //         userId: userId,
            //         nameUser: findUser.name,
            //     },
            // });
        } catch (error) {
            throw new InternalServerErrorException('[ERROR] Failed to send email invitation');
        }
    }

    async findOne(where: FindOneOptions<User>): Promise<User> {
        const user = await this.userRepository.findOne(where);

        if (!user) {
            throw new NotFoundException(`There isn't any user with identifier`);
        }

        return user;
    }
    async findOneByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(data: Partial<User>): Promise<User> {
        // if ((!data.email && !data.walletAddress) || !data.email || !data.walletAddress) {
        //     throw new BadRequestException('User has no email or wallet address');
        // }
        // const stripeCustomer = await this.stripeService.createCustomer(data.walletAddress, data.email);

        const user = this.userRepository.create(data);
        const result = await this.userRepository.save(user);
        this.defaultUserSettingQueue.add({
            userId: user.id,
        });
        return result;
    }

    async sendMailSignUp(email: string, userId: number) {
        try {
            if (!email) {
                throw new BadRequestException('email not found');
            }
            const token = this.getRandomToken();
            await this.userRepository.update(userId, { token });

            this.sendMailVerifyQueue.add({
                emailType: 'SIGN_UP_MAIL',
                email: email,
                params: { userId: userId, token },
            });
        } catch (error) {
            throw new InternalServerErrorException('[ERROR] Failed to send email sign up');
        }
    }

    async sendMailResetPassword(email: string, userId: number) {
        try {
            if (!email) {
                throw new BadRequestException('email not found');
            }
            const token = this.getRandomToken();
            await this.userRepository.update(userId, { token });

            this.sendMailVerifyQueue.add({
                emailType: 'RESET_PASSWORD_MAIL',
                email: email,
                params: { userId: userId, token },
            });
        } catch (error) {
            throw new InternalServerErrorException('[ERROR] Failed to send email sign up');
        }
    }

    async sendVerifyEmail(user: User) {
        try {
            if (!user.email) {
                throw new BadRequestException('No email found');
            }
            if (user.verify === 'TRUE') {
                throw new BadRequestException('Already verify');
            }
            const token = this.getRandomToken();

            await this.userRepository.update(user.id, { token });
            this.sendMailVerifyQueue.add({
                emailType: 'VERIFIED_MAIL',
                email: user.email,
                params: { userId: user.id, token: token },
            });
        } catch (err) {
            throw new BadRequestException('Failed to send email');
        }
    }
    async verifyUserEmail(id: number, token: string) {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new BadRequestException('No user found');
        }

        if (user.token !== token) {
            return {
                ok: false,
            };
        }

        await this.markUserAsVerified(id);
        return {
            ok: true,
        };
    }

    async markUserAsVerified(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestException('No user found');
        }
        await this.userRepository.update(user.id, { verify: 'TRUE', token: '' });
    }
    async findUserWithStore(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`There isn't any user with identifier`);
        }
        return user;
    }
    async resetPassword(newPassword: string, token: string) {
        if (!token || token.length == 0) {
            throw new BadRequestException('Invalid token');
        }
        const user = await this.userRepository.findOne({ where: { token } });
        if (!user) {
            throw new NotFoundException('Invalid user');
        }

        user.password = newPassword;
        user.token = '';
        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }
    async checkResetPassword(id: number, lastPasswordResetRequest: Date) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`There isn't any user with identifier`);
        }
        const cooldownPeriodInMinutes = 10; // Adjust this cooldown period as needed
        if (user.lastPasswordResetRequest) {
            const currentTime = new Date();
            const timeSinceLastRequest = currentTime.getTime() - user.lastPasswordResetRequest.getTime();
            const cooldownTimeInMs = cooldownPeriodInMinutes * 60 * 1000;

            if (timeSinceLastRequest < cooldownTimeInMs) {
                throw new HttpException(
                    `Password reset request is on cooldown. Try again after ${cooldownPeriodInMinutes} minutes.`,
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }
        }
        const dateUpdate = await this.userRepository.update(user.id, {
            lastPasswordResetRequest: lastPasswordResetRequest,
        });
        return dateUpdate;
    }
}
