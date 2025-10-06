import 'dotenv/config';
import express from 'express';
import ordersRouter from './routes/orders.routes.js';
import { ensureOrdersTable } from './bootstrap/dynamo-init.js';
import { startKafkaConsumer } from './kafka/consumer.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_, res) => {
    res.json({
        status: 'ok',
        service: 'order-service',
        useDynamoDB: String(process.env.USE_DYNAMODB || 'false'),
    });
});

app.use('/api/orders', ordersRouter);

// 404
app.use((_, res) => res.status(404).json({ error: 'Not found' }));

app.listen(port, async () => {
    // Init DynamoDB si activé
    if ((process.env.USE_DYNAMODB || '').toLowerCase() === 'true') {
        try {
            await ensureOrdersTable();
            console.log(`DynamoDB table '${process.env.DYNAMODB_TABLE || 'Orders'}' prête`);
        } catch (err) {
            console.error('Erreur init DynamoDB:', err?.message || err);
        }
    }

    try {
        await startKafkaConsumer();
        console.log('Kafka consumer started');
    } catch (err) {
        console.error('Erreur démarrage Kafka consumer:', err?.message || err);
    }

    console.log(`Order Service running on http://localhost:${port}`);
});
