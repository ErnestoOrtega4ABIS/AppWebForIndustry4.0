import { getAllUsers, getUserByUsername, saveUser, updateUser, deleteUser } from "../controllers/user.controller";
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/get-all', (req: Request, res: Response) => {
  getAllUsers(req, res);
});

router.get('/getbyusername/:username', (req: Request, res: Response) => {
  getUserByUsername(req, res);
});

router.post('/new', (req: Request, res: Response) => {
  saveUser(req, res);
});

router.put('/update/:userId', (req: Request, res: Response) => {
  updateUser(req, res);
});

router.delete('/delete/:userId', (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;