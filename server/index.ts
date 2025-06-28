import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const app = express();
const PORT = 5000;
const SECRET = 'mysecretkey';

app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/finance_dashboard')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define schema
const transactionSchema = new mongoose.Schema({
  id: Number,
  date: String,
  amount: Number,
  category: String,
  status: String,
  user_id: String,
  user_profile: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// ✅ Login route
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ JWT Middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401); // ⬅️ no return
    return;
  }

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403); // ⬅️ no return
      return;
    }
    (req as any).user = user;
    next();
  });
}


// ✅ Get all transactions
app.get('/api/transactions', authenticate, async (req: Request, res: Response) => {
  const data = await Transaction.find();
  res.json(data);
});

// ✅ Export selected fields to CSV
app.post('/api/export', authenticate, async (req: Request, res: Response) => {
  const { fields } = req.body;

  const projection = fields.reduce((acc: Record<string, number>, f: string) => {
    acc[f] = 1;
    return acc;
  }, {});

  const data = await Transaction.find({}, projection);

  const csvWriter = createObjectCsvWriter({
    path: 'transactions.csv',
    header: fields.map((f: string) => ({
      id: f,
      title: f.toUpperCase()
    })),
  });

  await csvWriter.writeRecords(data);
  const file = fs.createReadStream('transactions.csv');
  res.setHeader('Content-disposition', 'attachment; filename=transactions.csv');
  res.setHeader('Content-Type', 'text/csv');
  file.pipe(res);
});

// ✅ Root route (optional)
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Backend is up and running!");
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
