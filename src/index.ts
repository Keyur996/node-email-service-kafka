import { Consumer } from 'kafkajs';
import { kafka } from './kafka';
import Mailer from '@/lib/mailer';
import { MailerArgs } from './lib/interfaces/mailer.interface';

class EmailService {
  private static emailConsumer: Consumer;
  constructor() {}

  static readonly isMailerArgs = (data: any): data is MailerArgs => {
    return data && !Array.isArray(data?.to) && data.templateName !== undefined;
  };

  static readonly run = async () => {
    this.emailConsumer = kafka.consumer({
      groupId: 'email_consume',
    });

    await this.emailConsumer.connect();

    await this.emailConsumer.subscribe({
      topic: 'emailConsume',
      fromBeginning: true,
    });

    await this.emailConsumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        console.log(message.value?.toString());

        const emailDetails = JSON.parse(message.value?.toString() || '');
        if (emailDetails) {
          Array.isArray(emailDetails)
            ? await Promise.all(
                (emailDetails || []).map((detail: any) => {
                  if (this.isMailerArgs(detail)) {
                    new Mailer(detail).send();
                  }
                })
              )
            : await new Mailer(emailDetails).send();
        }
      },
    });
  };
}

EmailService.run().catch(console.log);
