import { Router } from 'express';
import {
    listOrders,
    getOrderById,
    createOrder,
    deleteOrder,
} from '../controllers/orders.controller.js';

const router = Router();

router.get('/', listOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;