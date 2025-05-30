import { loginMethod, getTimeToken, updateToken, getAllUsers, getUserByUsername, saveUser, updateUser, deleteUser } from "../controllers/auth.controller";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/login-user", (req: Request, res: Response) => {
  loginMethod(req, res);
});

router.get('/time/:userId', (req: Request, res: Response) => {
  getTimeToken(req, res);
});

router.put('/update/:userId', (req: Request, res: Response) => {
  updateToken(req, res);
});

router.get('/users', (req: Request, res: Response) => {
  getAllUsers(req, res);
});

router.get('/user/:username', (req: Request, res: Response) => {
  getUserByUsername(req, res);
});

router.post('/users/create', (req: Request, res: Response) => {
  saveUser(req, res);
});

router.put('/users/update/:userId', (req: Request, res: Response) => {
  updateUser(req, res);
});

router.delete('/users/delete/:userId', (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router; 