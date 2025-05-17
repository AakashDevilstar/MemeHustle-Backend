import './config.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import memeRoutes from './routes/memeRoutes.js';
import { initSocket } from './socket/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

initSocket(io);

app.use(cors());
app.use(express.json());

app.use('/api/memes', memeRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
