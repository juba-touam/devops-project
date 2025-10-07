import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const {
    DYNAMODB_ENDPOINT,
    AWS_REGION = 'us-east-1',
} = process.env;

const client = new DynamoDBClient({
    region: AWS_REGION,
    endpoint: DYNAMODB_ENDPOINT || undefined,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
    },
});

export const ddbDoc = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
});