import prisma from "../../../../../lib/prisma";
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";
import cookie from 'cookie';
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers first
    await cors(req, res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(401).json({ message: "Only POST call can be made" });
    }

    const { name, password, phone, email } = req.body;
 
    // Log incoming request data for debugging
    console.log("Incoming request data:", { name, password, phone, email });

    // Validate required fields
    if (!name || !password || !phone || !email) {
        console.error("Validation failed: Missing required fields");
        return res.status(400).json({ message: "All fields (name, password, phone, email) are required" });
    }

    try {
        const existingUser = await prisma.client.findUnique({ where: { email } });

        if (existingUser) {
            console.error("User already exists:", email);
            return res.status(401).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const clientUser = await prisma.client.create({
            data: {
                name,
                email,
                password: hashPassword,
                phone: String(phone) // Ensure phone is a string
            }
        });
     const token = jwt.sign(
           { id: clientUser.id, role: "client" }, // Ensure the correct role is set
           "Prajwal"!, 
           { expiresIn: "1h" }
       );
        console.log("User registered successfully:", clientUser);
        
           res.setHeader('set-cookie',cookie.serialize('clientToken',
                token,{
                    httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                }
            ))
        res.status(201).json({ message: 'User registered successfully', clientUser });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}