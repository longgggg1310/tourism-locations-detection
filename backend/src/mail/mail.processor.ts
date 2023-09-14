import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { IMailStrategy, SendEmailJobData } from './interfaces';
import { ISendSignupEmailContext, ISendVerifyEmailContext, MailService } from './mail.service';

class MailStrategyFactory {
    constructor(private readonly mailService: MailService) {}
    getStrategy(emailType: string): IMailStrategy {
        const strategies: Record<string, IMailStrategy> = {
            VERIFIED_MAIL: {
                execute: (data: { to: string; context: ISendVerifyEmailContext }) =>
                    this.mailService.sendVerifyMail(data),
            },
            SIGN_UP_MAIL: {
                execute: (data: { to: string; context: ISendSignupEmailContext }) =>
                    this.mailService.sendMailSignUp(data),
            },
            RESET_PASSWORD_MAIL: {
                execute: (data: { to: string; context: ISendSignupEmailContext }) =>
                    this.mailService.resetPassword(data),
            },
        };
        const strategy = strategies[emailType];
        if (!strategy) {
            throw new Error(`Unhandled email type: ${emailType}`);
        }

        return strategy;
    }
}
@Processor('send-email')
export class SendEmailService {
    logger = new Logger(SendEmailService.name);
    private readonly mailStrategyFactory: MailStrategyFactory;
    constructor(private readonly mailService: MailService) {
        this.mailStrategyFactory = new MailStrategyFactory(mailService);
    }

    @Process()
    async sendMail(job: Job<SendEmailJobData>) {
        const data = job.data;
        const { emailType, params, email } = data;
        const strategy = this.mailStrategyFactory.getStrategy(emailType);
        await strategy.execute({ to: email, context: params });
    }
}
