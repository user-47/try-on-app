// app/api/tryon.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photo, item } = req.body; // URLs or base64

    // Call Replicate
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "MODEL_VERSION_ID", // Replace with model version
        input: {
          person_image: photo,
          clothing_image: item
        }
      })
    });

    const data = await replicateResponse.json();

    // Polling the output until it's ready
    let outputUrl = null;
    while (!outputUrl) {
      const check = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      const checkData = await check.json();
      if (checkData.status === 'succeeded') {
        outputUrl = checkData.output[0]; // URL of generated image
      } else if (checkData.status === 'failed') {
        return res.status(500).json({ error: 'Replicate generation failed' });
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return res.status(200).json({ output: outputUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
