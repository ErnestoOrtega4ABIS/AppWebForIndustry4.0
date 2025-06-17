import { Router, Response, Request } from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/product.controller';

const router = Router();

router.post('/new', (req: Request, res: Response) =>{
    createProduct(req, res);
});

router.get('/get-all', (req: Request, res: Response) => {
    getAllProducts(req, res);
})

router.put('/update/:id', (req: Request, res: Response) => {
    updateProduct(req, res);
})

router.delete('/delete/:id', (req: Request, res: Response) => {
    deleteProduct(req, res)
})

export default router;