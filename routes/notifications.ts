import express from 'express';
import { Notification } from '../models/Notification.ts';
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
  const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.put('/:id', authMiddleware, async (req: any, res) => {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { read: true });
    res.json({ success: true });
});

export const addNotification = async (userId: string, message: string) => {
    await Notification.create({ userId, message });
};

export default router;
