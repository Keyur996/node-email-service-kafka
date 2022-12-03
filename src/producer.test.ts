import { CompressionTypes } from 'kafkajs';
import { producer } from './kafka/index';
import { MailerArgs } from './lib/interfaces/mailer.interface';

const run = async () => {
  await producer.connect();

  const transaction = await producer.transaction();

  const data: MailerArgs = {
    to: ['keyurmachhi123@gmail.com'],
    subject: 'Test Mail From Keyur',
    templateName: 'testMail',
  };

  try {
    await transaction.sendBatch({
      compression: CompressionTypes.GZIP,
      topicMessages: [
        {
          topic: 'emailConsume',
          messages: [
            {
              value: JSON.stringify(data),
            },
          ],
        },
      ],
    });
    await transaction.commit();
  } catch (err) {
    throw err;
    // await transaction.abort();
  }

  await producer.disconnect();
};

run().catch(console.log);
