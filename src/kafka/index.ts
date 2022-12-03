import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'email_consume',
});

export const producer = kafka.producer({
  transactionalId: 'email_consume_Transaction',
});
