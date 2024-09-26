const Event = require('../models/Event');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve events', error });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve event', error });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { Eventname, Description,Eventimg, StartTime, EndTime, status, ItemIDs, createdby } = req.body;

    try {
        const newEvent = new Event({
            Eventname,
            Description,
            Eventimg,   
            StartTime,
            EndTime,
            status,
            ItemIDs,
            createdby
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', newEvent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create event', error });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const { Eventname, Description, StartTime, EndTime, status, Itemid, createdby } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { Eventname, Description,Eventimg, StartTime, EndTime, status, Itemid, createdby },
            { new: true } // To return the updated document
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully', updatedEvent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update event', error });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event', error });
    }
};

exports.getRandomEvents = async (req, res) => {
    try {
      const randomEvents = await Event.aggregate([{ $sample: { size: 3 } }]); // Retrieve 3 random events
      res.status(200).json(randomEvents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch random events', error });
    }
  };
