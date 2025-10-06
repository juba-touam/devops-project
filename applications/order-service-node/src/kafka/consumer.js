import { Kafka } from 'kafkajs';
import { buildOrder } from '../models/order.model.js';
import { putOrderDDB } from '../repositories/orders.dynamo.js';

const {
    KAFKA_BROKERS = 'kafka:9092',
    KAFKA_GROUP_ID = 'order-service-consumer',
    KAFKA_TOPIC_ORDERS = 'orders.create.v1'
} = process.env;

export async function startKafkaConsumer() {
    const kafka = new Kafka({ clientId: 'order-service', brokers: KAFKA_BROKERS.split(',') });
    const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC_ORDERS, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const key = message.key?.toString();
                const payload = JSON.parse(message.value.toString());

                const order = buildOrder({
                    id: Number(payload.orderId),
                    productName: payload.productName,
                    price: payload.price,
                    quantity: payload.quantity,
                    createdAt: new Date().toISOString(),
                });

                await putOrderDDB(order);
                console.log(` [${topic}] stored order ${order.id} (key=${key})`);
            } catch (e) {
                console.error(' error handling message:', e);
            }
        }
    });

    return consumer;
}
