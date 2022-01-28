import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import placeRoutes from './routes/place.routes';
import checkToken from './middlewares/checkToken';

dotenv.config();

console.log('running');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/login', userRoutes);
app.use('/places', checkToken, placeRoutes);

export { app };
