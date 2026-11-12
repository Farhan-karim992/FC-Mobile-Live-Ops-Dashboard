import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';
import playerRoutes from './routes/playerRoutes';
import liveopsRoutes from './routes/liveopsRoutes';
import { networkSimulatorMiddleware, errorHandler } from './middleware/networkSimulator';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-simulate-delay', 'x-simulate-error'],
  })
);

app.use(express.json());

// DevTools performance & latency simulation middleware
app.use(networkSimulatorMiddleware);

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'FC Mobile Live-Ops Backend REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
app.use('/api/events', eventRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/liveops', liveopsRoutes);

// Centralized Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚽ FC Mobile Live-Ops Backend REST API is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚡ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛠️ DevTools Latency: support header 'x-simulate-delay'`);
  console.log(`====================================================`);
});
