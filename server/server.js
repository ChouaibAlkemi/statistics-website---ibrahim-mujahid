const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/feedback', require('./routes/feedback'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
