import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Converted'], default: 'New' },
  score: { type: Number, default: 0 },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.model('Lead', leadSchema);
