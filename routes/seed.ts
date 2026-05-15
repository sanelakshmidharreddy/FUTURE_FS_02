import express from 'express';
import { Lead } from '../models/Lead.ts';
import { Activity } from '../models/Activity.ts';
import { Notification } from '../models/Notification.ts';
import { User } from '../models/User.ts';
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

router.post('/', authMiddleware, async (req: any, res) => {
  const userId = req.user.userId;
  
  // Clear old data for current user
  await Lead.deleteMany({ userId });
  await Activity.deleteMany({ userId });
  await Notification.deleteMany({ userId });

  const statuses = ['New', 'Contacted', 'Converted'];
  const priorities = ['Low', 'Medium', 'High'];
  const companies = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp'];

  const leads = [];
  for (let i = 0; i < 50; i++) {
    leads.push({
      userId,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: `555-${1000 + i}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      score: Math.floor(Math.random() * 100),
    });
  }
  await Lead.insertMany(leads);

  await Activity.create({ userId, action: 'Seeded Demo Data', details: 'Leads, Activities, Notifications' });
  await Notification.create({ userId, message: 'Your CRM has been populated with 50 sample leads!' });

  res.json({ success: true });
});

export default router;
