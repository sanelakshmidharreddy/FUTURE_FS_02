import express from 'express';
import { Lead } from '../models/Lead.ts';
import jwt from 'jsonwebtoken';
import { logActivity } from './activities.ts';
import { scoreLead } from '../src/services/geminiService.ts';

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
  const leads = await Lead.find({ userId: req.user.userId });
  res.json(leads);
});

router.post('/', authMiddleware, async (req: any, res) => {
  const score = await scoreLead(req.body);
  const priority = score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low';
  const lead = await Lead.create({ ...req.body, userId: req.user.userId, score, priority });
  await logActivity(req.user.userId, 'Lead Created', lead.name);
  res.status(201).json(lead);
});

router.put('/:id', authMiddleware, async (req: any, res) => {
  const lead = await Lead.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, { new: true });
  await logActivity(req.user.userId, 'Lead Updated', lead?.name);
  res.json(lead);
});

router.delete('/:id', authMiddleware, async (req: any, res) => {
  const lead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  await logActivity(req.user.userId, 'Lead Deleted', lead?.name);
  res.status(204).end();
});

export default router;
