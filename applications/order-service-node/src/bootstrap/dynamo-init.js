import {
    DynamoDBClient,
    CreateTableCommand,
    DescribeTableCommand,
    waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';

const {
    DYNAMODB_ENDPOINT,
    AWS_REGION = 'us-east-1',
    DYNAMODB_TABLE = 'Orders',
    AWS_ACCESS_KEY_ID = 'dummy',
    AWS_SECRET_ACCESS_KEY = 'dummy',
} = process.env;

const client = new DynamoDBClient({
    region: AWS_REGION,
    endpoint: DYNAMODB_ENDPOINT || undefined,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

async function withRetry(fn, { retries = 10, baseDelayMs = 500 } = {}) {
    let err;
    for (let i = 0; i < retries; i++) {
        try { return await fn(); }
        catch (e) {
            const transient =
                e?.code === 'ECONNREFUSED' ||
                e?.code === 'ENOTFOUND' ||
                e?.name === 'TimeoutError';
            if (!transient || i === retries - 1) { err = e; break; }
            const delay = Math.round(baseDelayMs * Math.pow(1.6, i)); // backoff
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw err;
}

export async function ensureOrdersTable() {
    try {
        await withRetry(() =>
            client.send(new DescribeTableCommand({ TableName: DYNAMODB_TABLE }))
        );
        return;
    } catch (e) {
        if (e?.name === 'ResourceNotFoundException') {
            await withRetry(() =>
                client.send(new CreateTableCommand({
                    TableName: DYNAMODB_TABLE,
                    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'N' }],
                    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
                    BillingMode: 'PAY_PER_REQUEST',
                }))
            );

            await waitUntilTableExists(
                { client, maxWaitTime: 60, minDelay: 2 },
                { TableName: DYNAMODB_TABLE },
            );
            return;
        }
        throw e;
    }
}