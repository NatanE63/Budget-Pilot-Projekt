import type { VercelRequest, VercelResponse } from '@vercel/node';

// This simulates the Vercel Serverless Function structure
// In a real repo, this file sits in /api folder
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = request.body;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token || !secret) {
    return response.status(400).json({ success: false, message: 'Missing token or secret' });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const result = await fetch(verifyUrl, { method: 'POST' });
    const data = await result.json();

    if (data.success) {
      return response.status(200).json({ success: true });
    } else {
      return response.status(400).json({ success: false, error: data['error-codes'] });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
