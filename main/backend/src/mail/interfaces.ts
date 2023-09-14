import { ISendSignupEmailContext, ISendVerifyEmailContext } from './mail.service';

export interface IMailStrategy {
    execute: (data: { to: string; context: any }) => Promise<void>;
}
export type SendEmailJobData =
    | {
          emailType: 'VERIFIED_MAIL';
          email: string;
          params: ISendVerifyEmailContext;
      }
    | {
          emailType: 'SIGN_UP_MAIL';
          email: string;
          params: ISendSignupEmailContext;
      }
    | {
          emailType: 'RESET_PASSWORD_MAIL';
          email: string;
          params: ISendSignupEmailContext;
      };
