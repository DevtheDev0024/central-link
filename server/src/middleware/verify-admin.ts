import type { NextFunction, Request, Response } from 'express';
import { getAuth } from '../config/firebase-admin.js';
import { isAdminEmail } from '../config/admins.js';

export type AuthenticatedRequest = Request & {
  adminUid?: string;
  adminEmail?: string;
};

function decodeTokenPayload(token: string) {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      aud?: string;
      iss?: string;
      email?: string;
      exp?: number;
      iat?: number;
      auth_time?: number;
    };
  } catch {
    return null;
  }
}

export async function verifyAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token.' });
  }

  const token = authorization.slice('Bearer '.length);

  try {
    const decoded = await getAuth().verifyIdToken(token);

    if (!isAdminEmail(decoded.email)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    req.adminUid = decoded.uid;
    req.adminEmail = decoded.email ?? undefined;
    return next();
  } catch (error) {
    const tokenPayload = decodeTokenPayload(token);

    console.error('Firebase ID token verification failed:', {
      error,
      tokenPayload,
      serverNow: Math.floor(Date.now() / 1000),
    });
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
}
