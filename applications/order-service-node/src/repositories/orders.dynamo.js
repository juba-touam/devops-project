import { ddbDoc } from '../db/dynamo.js';
import { PutCommand, GetCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const TABLE = process.env.DYNAMODB_TABLE || 'Orders';

export async function putOrderDDB(order) {
    await ddbDoc.send(new PutCommand({
        TableName: TABLE,
        Item: order,
    }));
    return order;
}

export async function getOrderDDB(id) {
    const res = await ddbDoc.send(new GetCommand({
        TableName: TABLE,
        Key: { id: Number(id) },
    }));
    return res.Item || null;
}

export async function deleteOrderDDB(id) {
    await ddbDoc.send(new DeleteCommand({
        TableName: TABLE,
        Key: { id: Number(id) },
    }));
    return true;
}

export async function listOrdersDDB() {
    const res = await ddbDoc.send(new ScanCommand({
        TableName: TABLE,
    }));
    return res.Items || [];
}
