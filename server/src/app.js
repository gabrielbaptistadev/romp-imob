import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes.js';

const app = express();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}));

app.use(express.json());
app.use(cookieParser()); 
app.use('/api', routes);

export default app;
