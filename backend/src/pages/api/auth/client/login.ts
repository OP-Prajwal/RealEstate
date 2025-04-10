import { NextApiRequest, NextApiResponse } from "next";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import prisma from "../../../../../lib/prisma";
import cookie from 'cookie';
import cors from "@/middleware/corsMIddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Handle actual request
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    try {
        const ClientUser = await prisma.client.findUnique({ where: { email } });
        if (!ClientUser) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, ClientUser.password);
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        const token = Jwt.sign({ id: ClientUser.id, role: "client" }, "Prajwal", { expiresIn: "7d" });

        res.setHeader('set-cookie', cookie.serialize('clientToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        }));

        res.status(200).json({ message: "Logged in successfully", id: ClientUser.id, token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
