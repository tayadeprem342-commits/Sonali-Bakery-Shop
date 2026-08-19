const express = require('express');
const cors    = require('cors');
const http    = require('http');
const dotenv  = require('dotenv');

const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const errorHandler  = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app    = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/menu',   require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin',  require('./routes/adminRoutes'));

app.get('/', (_, res) => res.json({ message: 'Bakery API is running 🍰' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
