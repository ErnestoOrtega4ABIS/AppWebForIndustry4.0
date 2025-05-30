import { Request, Response } from "express";
import { cache, generateAccessToken, verifyAccessToken } from '../utils';
import { User } from '../models/User';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';




export const loginMethod = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        // Check if the user is active and exists
        if (!user || !user.status) {
            return res.status(404).json({
                message: "Invalid credentials"
            });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate access token
        const userId = user._id.toString();
        const accessToken = generateAccessToken(userId);
        cache.set(userId, accessToken, 60 * 15); // 15 minutes
        return res.json({ accessToken, message: "Succesfully Login" });


    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

export const getTimeToken = (req: Request, res: Response) => {
    const { userId } = req.params;

    const ttl = cache.getTtl(userId);

    if (!ttl) {
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

    if (!ttl) {
        return res.status(404).json({
            message: "Token not found or does not exist"
        })
    }

    const newTimeToken: number = 60 * 15;
    //Update Time To Live
    cache.ttl(userId, newTimeToken);

    res.json({ message: "Token updated successfully" });
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const saveUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName,
            username, email, password, role } = req.body;

        // Check if user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //Check if username already exists
        const existingUsername = await User.find({ username });
        if (existingUsername.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role
        });

        const user = await newUser.save();
        return res.json({ user });


    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { firstName, lastName, username, email, role, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userEmail = await User.find({ email });
    if ( userEmail.length > 0 && userEmail[0]._id.toString() !== userId) {
        return res.status(426).json({ message: "Email already exists" });
    
    }
    //const hashedPassword = await bcrypt.hash(password, 10);


    const hashedPassword = await bcrypt.hash(password, 10);

    //Validate password ever exists
    user.password = password != null ? hashedPassword : user.password;
    user.username = username != null ? username : user.username;
    user.email = email != null ? email : user.email;
    user.role = role != null ? role : user.role;
    user.firstName = firstName != null ? firstName : user.firstName;
    user.lastName = lastName != null ? lastName : user.lastName;

    const updatedUser = await user.save();
    return res.json({ updatedUser });

}

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.status = false;
    user.deleteDate = new Date();

    const deleteUser = await user.save();
    return res.json({ deleteUser, message: "User deleted successfully" });
}