import ejs from 'ejs';
import path from 'path';
import { MailService } from '@sendgrid/mail';
import { SEND_GRID_API_KEY, FROM_MAIL } from '@/config';
import { MailerArgs } from './interfaces/mailer.interface';

export default class Mailer {
  private readonly sgApi: MailService;
  private readonly from: string;

  constructor(private readonly data: MailerArgs) {
    this.sgApi = new MailService();
    this.from = FROM_MAIL!;
    this.sgApi.setApiKey(SEND_GRID_API_KEY!.trim());
  }

  private readonly convertToHtml = async () => {
    return ejs.renderFile(
      `${path.resolve(
        process.cwd(),
        `src/templates/${this.data.templateName}.ejs`
      )}`,
      this.data.replacement || {}
    );
  };

  public readonly send = async () => {
    const html = await this.convertToHtml();
    const data = await this.sgApi.sendMultiple({
      from: this.from,
      to: this.data.to,
      cc: this.data.cc,
      bcc: this.data.bcc,
      subject: 'Test Subject',
      html,
      ...this.data.options,
    });

    console.log(JSON.stringify(data, null, 2));
  };
}
