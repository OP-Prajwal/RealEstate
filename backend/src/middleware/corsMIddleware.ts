// /middleware/corsMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function cors(req: NextApiRequest, res: NextApiResponse) {
    // Always set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Critical: Handle OPTIONS request immediately
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Max-Age', '86400');
        res.status(200).end();
        return true;
    }

    return false;
}
