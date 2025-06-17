import { loginMethod, getTimeToken, updateToken } from "../controllers/auth.controller";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/login-user", (req: Request, res: Response) => {
  loginMethod(req, res);
});

router.get('/time/:userId', (req: Request, res: Response) => {
  getTimeToken(req, res);
});

router.put('/update-token/:userId', (req: Request, res: Response) => {
  updateToken(req, res);
});



export default router; 