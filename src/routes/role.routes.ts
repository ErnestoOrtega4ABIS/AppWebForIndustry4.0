import { Router, Response, Request } from 'express';
import { createRole } from '../controllers/role.controller';

const router = Router();

router.post('/new', (req: Request, res: Response) => {
    createRole(req, res);
});

export default router;