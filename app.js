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
const moment = require('moment');



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
const User = require('./models/User');


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
const io = new server(expressServer, {
  pingInterval: 60000,
  pingTimeout: 60000
});

io.on('connection', (socket) => {
  console.log(`User: ${socket.id} connected`);


  socket.on('join event', async (eventId) => {
    socket.join(eventId); // Join the room for that specific event
    try {
      // Filter messages by EventId and sort by sentAt date
      console.log(eventId);
      const messages = await message.find({ EventId: eventId }).populate('senderId', 'username').sort({ sentAt: 1 });

      const formattedMessages = messages.map((msg) => {
        return {
          sender: msg.senderId.username,  // User's name from senderId
          message: msg.message,       // Message content
          time: moment(msg.sentAt).format('HH:mm A'), // Convert to HH:MM format
          senderId: msg.senderId._id,
          _id: msg._id // The ID of the user who sent it
        };
      });
      console.log(formattedMessages);
      // Emit the formatted messages to the client
      socket.emit('previous messages', formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      socket.emit('error', 'Could not fetch messages');
    }
  });

  // Listen for 'chat message' events
  socket.on('chat message', async (incomingMsg) => {
    // Prepare the msgData to be stored
    const msgData = {
      senderId: incomingMsg.senderId,
      EventId: incomingMsg.EventId,
      message: incomingMsg.message,
      status: 'Sent',
      sentAt: new Date()
    };

    // Create a new message instance
    const newMessage = new message(msgData);

    try {
      // Save the new message to the database
      await newMessage.save();

      const user = await User.findById(incomingMsg.senderId);
      if (user) {

        const messagetosend = {
          ...newMessage.toObject(), // Convert Mongoose document to a plain object
          sender: user.username, // Add the sender's username
          time: moment(newMessage.sentAt).format('HH:mm A'), // Add formatted time
          _id: newMessage._id
        };

        // Log the message with the added fields
        // console.log(messagetosend);
        // Emit the message to all clients, including the sender's name
        io.emit('chat message', messagetosend);
      } else {
        console.error('User not found:', incomingMsg.senderId);
      }

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('delete-message', async (messageId) => {
    io.emit('message-deleted', messageId);
  });

  socket.on('update-message', async ({ messageId, message }) => {
    console.log(messageId, message)
    io.emit('message-updated', { messageId, message });
  });


  // Handle bid events
  socket.on('newBid', async (bidData) => {
    try {
      // Check if the user is the item owner
      console.log(bidData)
      const Item = await item.findById(bidData.itemId);
      if (Item && Item.Userid.toString() === bidData.userId) {
        console.log('bidError', 'You cannot bid on your own item.');
        socket.emit('bidError', 'You cannot bid on your own item.');
        return;
      }

      // Check if the bid is greater than the current highest bid
      const highestBid = await bid.find({ itemId: bidData.itemId }).sort({ bidinNaira: -1 });
      if (highestBid && bidData.bidinNaira <= highestBid.bidinNaira) {
        console.log('bidError', 'Your bid must be higher than the current highest bid.');
        socket.emit('bidError', 'Your bid must be higher than the current highest bid.');
        return;
      }

      // Create and save the new bid
      const newBid = new bid(bidData);
      await newBid.save();

      // Broadcast the new bid to all connected clients
      io.emit('bidAdded', newBid);

    } catch (error) {
      console.error('Error placing bid:', error);
      socket.emit('bidError', 'Failed to place bid.');
    }
  });

  socket.on('itemChanged', async ({ itemId, eventId }) => {
    console.log(`Client switched to item: ${itemId} for event: ${eventId}`);

    // Fetch bids for the new itemId and eventId
    try {
      const bids = await bid.find({ itemId, eventId });

      // Optionally, sort bids by magnitude (as discussed earlier)
      const sortedBids = await sortBidsByMagnitude(bids);

      // Emit the sorted bids to the client
      console.log(sortedBids)
      socket.emit('bidsFetched', sortedBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      socket.emit('bidError', 'Error fetching bids.');
    }
  });

  // Helper function to convert and sort bids by magnitude
  async function sortBidsByMagnitude(bids) {
    return bids.sort(async (a, b) => {
      const aAmount = a.bidinNaira;
      const bAmount = b.bidinNaira;
      return bAmount - aAmount;  // Sort in descending order (highest first)
    });
  }

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User: ${socket.id} disconnected`);
  });
});