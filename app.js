import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import urlsRouter from './routes/urls/index.js';

dotenv.config({ path: './config/.env' });
const app = express();

connectDB();


// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/urls', urlsRouter);

// Server Setup
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});