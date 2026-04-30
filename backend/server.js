import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AI Recipe Generator API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}` || 'development');
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Connected' : 'Not connected'}`);
});