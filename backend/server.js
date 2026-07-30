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

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes will be imported here
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hanan Data API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
