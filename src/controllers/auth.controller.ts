import dayjs from 'dayjs';
import  { Request, Response } from "express";
import { cache } from '../utils/cache';
import { generateAccessToken }from '../utils/token';


export const loginMethod = async (req: Request, res: Response) => {
    let name:string = "Ernesto";
    const {username, password} = req.body;

    if (username !=="admin" || password !== "admin") {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    // Generate JWT token
    let userId = "1234";
    const ACCESS_SECRET = 'secret1234utd'
    
    const accessToken = generateAccessToken(userId);

    cache.set(userId, accessToken, 15 * 60);
    return res.json({ accessToken });

}

export const getTimeToken=(req:Request, res:Response) => {
    const { userId } = req.params;

    const ttl = cache.getTtl(userId);

    if(!ttl){
        return res.status(404).json({
            message: "Token not found or does not exist"
        })
    }

    const now = Date.now();
    const timeToLife = Math.floor((ttl - now) / 1000);
    const expTime = dayjs(ttl).format('HH:mm:ss');

    return res.json({ timeToLife, expTime });
}

export const updateToken = (req: Request, res: Response) => {
    const { userId } = req.params;

    const ttl = cache.getTtl(userId);

    if(!ttl){
        return res.status(404).json({
            message: "Token not found or does not exist"
        })
    }

    const newTimeToken:number = 60 * 15;
    //Update Time To Live
    cache.ttl(userId, newTimeToken);

    res.json({ message: "Token updated successfully" });
}  