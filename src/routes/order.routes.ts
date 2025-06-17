import { saveOrder, getAllOrders, updateOrder, deleteOrder } from "../controllers/order.controller";
import { Router, Request, Response } from "express";

const router = Router()

router.get('/get-all', (req: Request, res: Response) => {
    getAllOrders(req,res);
});

router.post('/new', (req: Request, res: Response) => {
    saveOrder(req,res);
});

router.put('/update/:id', (req: Request, res: Response) => {
    updateOrder(req, res);
});

router.delete('/delete/:id', (req: Request, res: Response) => {
    deleteOrder(req, res);
});

export default router; 