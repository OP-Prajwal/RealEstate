import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '@/middleware/corsMIddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  res.status(200).end();
}
