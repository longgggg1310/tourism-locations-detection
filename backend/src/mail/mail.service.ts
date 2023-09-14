import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

export type ISendVerifyEmailContext = {
    userId: number;
    token: string;
};

export type ISendEmailOptions<T> = ISendMailOptions & {
    context: T;
};

export type ISendSignupEmailContext = {
    userId: number;
    token?: string;
};

@Injectable()
export class MailService {
    logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) {}

    async sendVerifyMail(options: ISendEmailOptions<ISendVerifyEmailContext>): Promise<void> {
        const verifyLink = `${process.env.MARKETPLACE_BASE_URL}/profile/verify/${options.context.userId}/${options.context.token}`;

        const emailVerify: ISendMailOptions = {
            to: options.to,
            from: process.env.MAIL_FROM,
            subject: 'Verify Email',
            template: __dirname + '/templates/verify-email', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
            context: {
                verifyLink: verifyLink,
            },
        };
        await this.sendMailWithTemplate(emailVerify);
    }
    async resetPassword(options: ISendEmailOptions<ISendSignupEmailContext>) {
        const setupAccountLink = `${process.env.MARKETPLACE_BASE_URL}/profile?createPasswordUserId=${options.context.userId}&token=${options.context.token}`;

        this.logger.log(`reset password link ${setupAccountLink}`);
        const emailSignup: ISendMailOptions = {
            to: options.to,
            from: process.env.MAIL_FROM,
            subject: 'Reset password for your account',
            template: __dirname + '/templates/reset-password', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
            context: {
                setupAccountLink: setupAccountLink,
            },
        };
        await this.sendMailWithTemplate(emailSignup);
    }
    async sendMailSignUp(options: ISendEmailOptions<ISendSignupEmailContext>) {
        this.logger.log(`User create account`);
        const setupAccountLink = 'Thanks for signing up';
        const emailSignup: ISendMailOptions = {
            to: options.to,
            from: process.env.MAIL_FROM,
            subject: 'Joining with us',
            template: __dirname + '/templates/sign-up-email', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
            context: {
                setupAccountLink: setupAccountLink,
            },
        };
        await this.sendMailWithTemplate(emailSignup);
    }

    async sendMailWithTemplate(options: ISendMailOptions): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: options.to,
                from: process.env.MAIL_FROM,
                ...options,
            });
        } catch (error) {
            console.log(error);
        }
    }
}
