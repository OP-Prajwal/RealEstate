import { NextApiRequest, NextApiResponse } from "next";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import prisma from "../../../../../lib/prisma";
import cookie from 'cookie';
import cors from "../../../../../middleware/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    try {
        const AgentUser = await prisma.agent.findUnique({
            where: { email }
        });
        if (!AgentUser) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, AgentUser.password);
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        const token = Jwt.sign({ id: AgentUser.id, role: "agent" }, "Prajwal"!, { expiresIn: "7d" });

        res.setHeader('set-cookie', cookie.serialize('agentToken',
            token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            }
        ));
        res.status(200).json({ message: "Logged in successfully", id: AgentUser.id, token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}