import { IMailStrategy, SendEmailJobData } from './interfaces';
import { MailService } from './mail.service';

describe('MailService Types', () => {
    let service: MailService;
    it('should pass type checks for SendEmailJobData', () => {
        const jobData1: SendEmailJobData = {
            emailType: 'VERIFIED_MAIL',
            email: 'test@example.com',
            params: {
                // Replace with properties specific to ISendVerifyEmailContext
                userId: 2,
                token: 'abc',
            },
        };

        const jobData2: SendEmailJobData = {
            emailType: 'SIGN_UP_MAIL',
            email: 'test@example.com',
            params: {
                // Replace with properties specific to ISendSignupEmailContext
                userId: 1,
                token: 'xyz',
            },
        };

        // Add more test cases for SendEmailJobData as needed
        expect(jobData1).toBeTruthy();
        expect(jobData2).toBeTruthy();
    });

    it('should pass type checks for IMailStrategy', () => {
        const strategy1: IMailStrategy = {
            execute: async (data: { to: string; context: any }) => {
                // Replace with the implementation for VERIFIED_MAIL strategy
            },
        };

        const strategy2: IMailStrategy = {
            execute: async (data: { to: string; context: any }) => {
                // Replace with the implementation for SIGN_UP_MAIL strategy
            },
        };

        // Add more test cases for IMailStrategy as needed
        expect(strategy1).toBeTruthy();
        expect(strategy2).toBeTruthy();
    });
});
