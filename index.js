import dotenv from 'dotenv';
dotenv.config()
import pool from './db/db.js';

import express from 'express';
import studentRoutes from './routes/students.js';





const app = express();

app.use(express.json());
app.use('/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Student API');
});

const PORT = 3000;  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

});

