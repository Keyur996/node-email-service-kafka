import { MailData } from '@sendgrid/helpers/classes/mail';

export interface MailerArgs {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  templateName: string;
  replacement?: { [key: string]: any };
  options?: Omit<
    MailData,
    'from' | 'to' | 'cc' | 'bcc' | 'content' | 'html' | 'text'
  >;
}
