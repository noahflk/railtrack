import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await axios.post(
      'https://api.logsnag.com/v1/log',
      {
        project: 'railtrack',
        channel: 'signup',
        description: 'now wit hthis',
        event: 'User signed up',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LOGSNAG_TOKEN}`,
        },
      }
    );

    res.status(200).json({ result: 'bla' });
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' });
  }
}
