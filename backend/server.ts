import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app',
  credentials: true
}));
app.use(express.json());

// 数据库模型
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  queries: [{
    topic: String,
    content: String,
    type: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', userSchema);

// API路由
app.post('/api/query', async (req, res) => {
  try {
    const { email, topic, content, type } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, queries: [] });
    }
    
    user.queries.push({ topic, content, type });
    await user.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/queries/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user?.queries || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 