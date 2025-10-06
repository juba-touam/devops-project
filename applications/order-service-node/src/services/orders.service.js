import { buildOrder } from '../models/order.model.js';
import { ensureOrdersTable } from '../bootstrap/dynamo-init.js';
import { putOrderDDB, getOrderDDB, deleteOrderDDB, listOrdersDDB } from '../repositories/orders.dynamo.js';

const useDDB = String(process.env.USE_DYNAMODB || 'false').toLowerCase() === 'true';

const mem = { orders: new Map() };
let currentId = 1;

function nowISO() { return new Date().toISOString(); }


export async function listOrdersService() {
    if (useDDB) {
        await ensureOrdersTable();
        return await listOrdersDDB();
    }
    return Array.from(mem.orders.values());
}

export async function getOrderByIdService(id) {
    if (useDDB) {
        await ensureOrdersTable();
        const item = await getOrderDDB(id);
        if (!item) {
            const err = new Error('Commande introuvable.');
            err.status = 404;
            throw err;
        }
        return item;
    }
    const order = mem.orders.get(Number(id));
    if (!order) {
        const err = new Error('Commande introuvable.');
        err.status = 404;
        throw err;
    }
    return order;
}

export async function createOrderService(payload) {
    const { productName, price, quantity } = payload || {};
    const nPrice = Number(price);
    const nQuantity = Number(quantity);

    if (!productName || Number.isNaN(nPrice) || Number.isNaN(nQuantity)) {
        const err = new Error('productName (string), price (number) et quantity (number) sont requis.');
        err.status = 400;
        throw err;
    }

    const id = useDDB ? Date.now() : currentId++; // simple id num (unique assez pour dev)
    const createdAt = nowISO();

    const order = buildOrder({ id, productName, price: nPrice, quantity: nQuantity, createdAt });

    if (useDDB) {
        await ensureOrdersTable();
        await putOrderDDB(order);
        return order;
    }

    mem.orders.set(id, order);
    return order;
}

export async function deleteOrderService(id) {
    if (useDDB) {
        await ensureOrdersTable();
        await deleteOrderDDB(id);
        return true;
    }
    const existed = mem.orders.delete(Number(id));
    if (!existed) {
        const err = new Error('Commande introuvable.');
        err.status = 404;
        throw err;
    }
    return true;
}