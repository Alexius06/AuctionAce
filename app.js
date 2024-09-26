require('dotenv').config();

// Middleware
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'], // Replace with your frontend origin
  credentials: true, // Allow credentials (cookies, headers)
};

const server = require('socket.io').Server




app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true, // To handle large files
  tempFileDir: './uploads' // Directory for temporary files
}));
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend on any unspecified route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const mongoose = require('mongoose');
const user = require('./models/User');
const item = require('./models/Item');
const event = require('./models/Event');
const bid = require('./models/Bid');
const message = require('./models/Message');
const payment = require('./models/Payment');
const notification = require('./models/Notification');
const review = require('./models/Review');







// Import Routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');


// Use Routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/bids', bidRoutes);
app.use('/events', eventRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes);
app.use('/auth', authRoutes);
mongoose.connect('mongodb://localhost:27017/AuctionDB')
  .then(async () => {


    console.log('MongoDB Connected...');
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

const expressServer = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
const io = new server(expressServer,{
  pingInterval: 60000,
  pingTimeout: 60000 
}); 

io.on('connection', async (socket) => {
    console.log(`User: ${socket.id} connected `);
    
})