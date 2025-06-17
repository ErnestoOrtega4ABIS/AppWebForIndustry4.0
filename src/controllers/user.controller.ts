import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


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
};

export const saveUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        if (!Array.isArray(role) || role.length === 0) {
            return res.status(400).json({ message: "At least one role is required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

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
        return res.status(201).json({ user });

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { firstName, lastName, username, email, role, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is already in use by another user
        if (email && email !== user.email) {
            const userEmail = await User.findOne({ email });
            if (userEmail && userEmail._id.toString() !== userId) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // Check if username is already in use by another user
        if (username && username !== user.username) {
            const userUsername = await User.findOne({ username });
            if (userUsername && userUsername._id.toString() !== userId) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        if (role && (!Array.isArray(role) || role.length === 0)) {
            return res.status(400).json({ message: "At least one role is required" });
        }

        // Optional password update
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        user.username = username ?? user.username;
        user.email = email ?? user.email;
        user.role = role ?? user.role;
        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;

        const updatedUser = await user.save();
        return res.status(200).json({ updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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


