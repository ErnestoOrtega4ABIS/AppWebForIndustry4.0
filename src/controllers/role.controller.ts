import { Response, Request } from 'express';
import { Role } from '../models/Role';

export const createRole = async (req: Request, res: Response) => {
    try {
        const { roleName, type } = req.body

        const newRole = new Role ({
            roleName,
            type
        });

        const role = await newRole.save();
        return res.json({ role });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}