const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const config = require('./config/database');
const userRoute = require('./routes/userRoutes');
const productRoute = require('./routes/productRoutes');
const cartRoute = require('./routes/cartRoutes');
const orderRoute = require('./routes/orderRoutes');
const jwt = require('jsonwebtoken');

const app = express();
const port = config.port || 4000;

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
// console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1]; 
  
  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = user;
    // console.log('Token verification successful');
    next();
  });
};

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/', productRoute);
app.use('/api/', authenticateToken, cartRoute);
app.use('/api/', authenticateToken, orderRoute);

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  app.get('/', (req, res) => {
    res.send(`<h1> Connected to The Brand Store Server </h1>`);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
