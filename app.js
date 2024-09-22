require('dotenv').config();

// Middleware
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const app = express();
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'], // Replace with your frontend origin
  credentials: true, // Allow credentials (cookies, headers)
};
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));


const mongoose = require('mongoose');
const user  = require('./models/User');
const item  = require('./models/Item');
const event  = require('./models/Event');   
const bid  = require('./models/Bid');
const message  = require('./models/Message');   
const payment  = require('./models/Payment');
const notification  = require('./models/Notification');
const review  = require('./models/Review');







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
.then(async() => {
    
    
    // let existingUser = await user.findOne({ username: 'johndoe' });
    // if (!existingUser) {
    //   const userdata = new user({
    //     username: 'johndoe',
    //     firstname: 'John',
    //     lastname: 'Doe',
    //     email: 'johndoe@gmail.com',
    //     password: 'password123',
    //     phoneNumber: 1234567890,
    //     role: 'bidder',
    //     isActive: true,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });
    //   existingUser = await userdata.save();
    // }

    // let existingEvent = await event.findOne({ Eventname: 'Exclusive Car Auction' });
    // if (!existingEvent) {
      // const eventdata = new event({
      //   Eventname: 'Exclusive Car Auction',
      //   Description: 'This is an exclusive car auction event.',
      //   StartTime: new Date('2022-01-01'),
      //   EndTime: new Date('2022-12-31'),
      //   status: 'Upcoming',
      //   createdby: existingUser._id,
      //   itemId: existingItem._id, 
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });
    //   existingEvent = await eventdata.save(); 
    // }


    // let existingItem = await item.findOne({ Itemname: 'Ferrari 911 spyder' });
    // if (!existingItem) {
      // const itemdata = new item({
      //   Itemname: 'Ferrari 911 spyder',
      //   Description: 'This is a Ferrari 911 spyder.',
      //   AskingPrice: 1000000,
      //   Userid: existingUser._id, 
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });
    //   existingItem = await itemdata.save();
    // }
    // let existingBid = await bid.findOne({ bidAmount: 1000000 });    
    // if (!existingBid) {
    //   const biddata = new bid({
    //     userId: existingUser._id,   
    //     itemId: existingItem._id,
    //     EventId: existingEvent._id,     
    //     bidAmount: 1000000,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });
      
    //   existingBid = await biddata.save();
    // }
    // let existingMessage = await message.findOne({ sentAt: new Date() });    
    // if (!existingMessage) {
    //   const messagedata = new message({
    //     senderId: existingUser._id,  
    //     EventId: existingEvent._id,   
    //     message: 'Good day, I am a test case',
    //     sentAt: new Date(),
    //     status: 'Sent',
    //     updatedAt: new Date()
    //   });     
      
    //   existingMessage = await messagedata.save();
    // }
    // let existingNotification = await notification.findOne({ sentAt: new Date() });    
    // if (!existingNotification) {
    //   const notificationdata = new notification({
    //     Notification: 'This is a test notification',
    //     userId: existingUser._id,   
    //     EventId: existingEvent._id,  
    //     type: 'Reminder',
    //     sentAt: new Date(),
    //     status: 'Sent'
    //   });
            
    //   existingNotification = await notificationdata.save();
    // }

    // let existingPayment = await payment.findOne({ createdAt: new Date() });    
    // if (!existingPayment) {
    //   const paymentdata = new payment({
    //     Amount: 100000,
    //     Status: 'pending',
    //     ItemId: existingItem._id,    
    //     UserId: existingUser._id,    
    //     BidId: existingBid._id,          
    //     EventId: existingEvent._id,  
    //     PaymentDate: new Date(),
    //     PaymentMethod: 'Bank Card',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });

    //   existingPayment = await paymentdata.save();
    // }

    // let existingReview = await review.findOne({ createdAt: new Date() });    
    // if (!existingReview) {
      // const reviewdata = new review({
      //   review_text: 'This is a test review for the site',
      //   rating: 2,
      //   itemId: existingItem._id,    
      //   userId: existingUser._id,    
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });

    //   existingReview = await reviewdata.save(); 
    // }
    
    
    console.log('MongoDB Connected...');
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

})        
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});