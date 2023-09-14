import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import nodemailer from 'nodemailer';
import { formatPrice, parseImageURL, upperCase, join } from './helpers';
import { BullModule } from '@nestjs/bull';
import { SendEmailService } from './mail.processor';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    service: 'Gmail',
                    // port: process.env.STMP_PORT ? +process.env.STMP_PORT : 465,
                    // host: process.env.STMP_HOST || '',
                    // secure: true,
                    auth: {
                        user: process.env.GMAIL_USERNAME,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: process.env.MAIL_FROM,
                },
                // preview: true,
                template: {
                    dir: process.cwd() + '/templates',
                    adapter: new HandlebarsAdapter({ parseImageURL, upperCase, formatPrice, join }),
                },
            }),
        }),
        BullModule.registerQueueAsync({
            name: 'send-email',
        }),
    ],
    providers: [MailService, SendEmailService],
    exports: [MailService],
})
export class MailModule {}
