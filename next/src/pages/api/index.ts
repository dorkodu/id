import { schema } from '@/lib/api/controllers/_schema';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).send(await schema.execute(() => ({ req, res }), req.body));
}
