import {
    listOrdersService,
    getOrderByIdService,
    createOrderService,
    deleteOrderService,
} from '../services/orders.service.js';


export async function listOrders(req, res) {
    try {
        const data = await listOrdersService();
        res.json({ data, count: data.length });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
}

export async function getOrderById(req, res) {
    try {
        const data = await getOrderByIdService(req.params.id);
        res.json({ data });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
}

export async function createOrder(req, res) {
    try {
        const data = await createOrderService(req.body); // <— await !
        res.status(201).json({ data });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
}

export async function deleteOrder(req, res) {
    try {
        await deleteOrderService(req.params.id); // <— await !
        res.status(204).send();
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
}
