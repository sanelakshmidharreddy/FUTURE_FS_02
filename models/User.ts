import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  avatar: { type: String },
  theme: { type: String, default: 'dark' },
});

export const User = mongoose.model('User', userSchema);
