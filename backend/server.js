const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1);

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes will be imported here
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentpointCtrl = require('./controllers/paymentpointController');
const { checkMaintenanceMode } = require('./middleware/maintenance');

app.all(['/api/paymentpoint/webhook', '/api/paymentpoint-webhook', '/api/webhook/paymentpoint', '/api/webhook'], (req, res, next) => {
  if (req.method === 'GET') {
    return res.status(200).send('PaymentPoint Webhook Endpoint is Active');
  }
  return paymentpointCtrl.handleWebhook(req, res, next);
});
app.use('/api/admin', adminRoutes);
app.use('/api', checkMaintenanceMode, userRoutes);

app.get('/', (req, res) => {
  res.send('Hanan Data API is running...');
});

app.use(notFound);
app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
global.io = io;

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize Cron Jobs
const { initCronJob } = require('./scripts/priceSync');
initCronJob();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} (listening on 0.0.0.0)`);
});
