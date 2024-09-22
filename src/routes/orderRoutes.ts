import { Router } from 'express';
import { getOrders, createOrder, getOneOrder, deleteOrder } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOneOrder);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
