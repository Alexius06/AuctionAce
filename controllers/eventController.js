const Event = require('../models/Event');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');
const cron = require('node-cron');
const scheduledJobs = {};
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
    const UserId = req.user ? req.user.id : req.body.userId;
    const { Eventname, Description, StartTime, EndTime, ItemIDs } = req.body;
    console.log(req.body);  
    console.log(req.files)

    try {
        if (req.files.eventimg.length = 0) {

            return res.status(400).json({
                success: false,
                message: 'You must upload an image.',
            });
        }
        let uploadedImages;

        try {
            const files = Array.isArray(req.files.eventimg) ? req.files.eventimg : [req.files.eventimg];
            // Upload each image to Cloudinary
            console.log(files);

            for (const file of files) {
                console.log(file.tempFilePath)

                if (!fs.existsSync(file.tempFilePath)) {
                    console.error('Temp file does not exist:', file.tempFilePath);
                    continue;
                }

                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    transformation: [
                        { width: 1000, crop: 'scale' },   // Resize and crop
                        { quality: 'auto:best' },              // Adjust quality
                        { fetch_format: 'auto' }          // Convert format
                    ],
                    folder: 'event_images' // Folder in Cloudinary
                });

                console.log('how  are  you  today')
                uploadedImages = result.secure_url; // Push the secure URL to the array
                console.log(uploadedImages)
            }



            const newEvent = new Event({
                Eventname,
                Description,
                Eventimg: uploadedImages ,
                StartTime,
                EndTime,
                status:'Upcoming',
                ItemIDs,
                createdby: UserId
            });

            await newEvent.save();
            scheduleEvent(newEvent);
            res.status(201).json({ message: 'Event created successfully', newEvent });
        }
        catch (error) {
            console.error('Cloudinary Upload Failed:', error);
            return res.status(500).json({
                success: false,
                message: 'Image upload to Cloudinary failed',
                error: error.message
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'Failed to create event', error });
    }
};

const scheduleEvent = (event) => {
    const { _id, StartTime, EndTime } = event;

    const startTimeDate = new Date(StartTime);
    const endTimeDate = new Date(EndTime);

    if (scheduledJobs[_id]) {
        scheduledJobs[_id].stop();
        delete scheduledJobs[_id];
    }

    // Schedule the start of the event
    scheduledJobs[_id] = cron.schedule('* * * * *', async () => {
        const now = new Date();
        if (now >= startTimeDate && now < endTimeDate) {
            console.log(`Starting event ${_id}`);
            await startEvent(_id);
        }
        else if (now >= endTimeDate) {
            console.log(`Closing event ${_id}`);
            await closeEvent(_id);
        }
    });
};


// Automatically start the event
const startEvent = async (eventId) => {
    try {
        const startedEvent = await Event.findByIdAndUpdate(eventId, { status: 'Ongoing' }, { new: true });
        if (startedEvent) {
            console.log(`Event ${eventId} has started automatically.`);
        }
    } catch (error) {
        console.error(`Failed to start event ${eventId}:`, error);
    }
};

// Automatically close the event
const closeEvent = async (eventId) => {
    try {
        const closedEvent = await Event.findByIdAndUpdate(eventId, { status: 'Ended' }, { new: true });
        if (closedEvent) {
            console.log(`Event ${eventId} has ended automatically.`);
        }
    } catch (error) {
        console.error(`Failed to close event ${eventId}:`, error);
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const UserId = req.user ? req.user.id : req.body.userId;
    const id = req.params.id;
    const { Eventname, Description, StartTime, EndTime, ItemIDs } = req.body;


    const event = await Event.findById(req.params.id)

    let uploadedImages;
    let updateData;
    try {
        if (req.files && req.files.eventimg) {
            const files = Array.isArray(req.files.eventimg) ? req.files.eventimg : [req.files.eventimg];

            for (const file of files) {


                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    transformation: [
                        { width: 1000, crop: 'scale' },
                        { quality: 'auto:best' },
                        { fetch_format: 'auto' }
                    ],
                    folder: 'UpdEvent_images' // Folder in Cloudinary
                });

                uploadedImages=result.secure_url; // Push the secure URL to the array
            }
            const updateEventData = {
                Eventname,
                Description,
                Eventimg:  uploadedImages,
                StartTime,
                EndTime,
                status: 'Upcoming', 
                ItemIDs, 
                createdby: UserId,
                
            };
            updateData= updateEventData
        }
        else{
            const updateEventData = {
                Eventname,
                Description,
                Eventimg:  event.Eventimg,
                StartTime,
                EndTime,
                status: 'Upcoming', 
                ItemIDs, 
                createdby: UserId,
                
            };
            updateData= updateEventData  
            
        }
        console.log(updateData); 
        console.log(id);    
        const updatedEvent = await Event.findByIdAndUpdate(id,  updateData,  { new: true });
        console.log(updatedEvent)
        
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        scheduleEvent(updatedEvent);
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
exports.CloseEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const closedevent = await Event.findByIdAndUpdate(id, { status: 'Ended' }, { new: true });
        if (!closedevent) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item verified successfully', closedevent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.StartEvent = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        const startedEvent = await Event.findByIdAndUpdate(id, { status: 'Ongoing' }, { new: true });
        if (!startedEvent) {
            console.log('Event not found');
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item verified successfully', startedEvent });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
