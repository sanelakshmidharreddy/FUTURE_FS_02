import express from 'express';
import { Activity } from '../models/Activity.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req: any, res) => {
  const activities = await Activity.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(10);
  res.json(activities);
});

export const logActivity = async (userId: string, action: string, details?: string) => {
    await Activity.create({ userId, action, details });
}

export default router;
