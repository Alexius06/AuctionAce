const Item = require('../models/Item');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');



// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific item by ID
exports.getItemById = async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new item
exports.createItem = async (req, res) => {
    const { Itemname, Description, AskingPrice, currency } = req.body;
    const UserId = req.user ? req.user.id : req.body.userId;
    console.log(Itemname, Description, AskingPrice, currency, req.files.images.length, UserId);


    if (req.files.images.length !== 3) {

        return res.status(400).json({
            success: false,
            message: 'You must upload 3 images.',
        });
    }
    let uploadedImages = [];

    try {
        const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
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
                folder: 'item_images' // Folder in Cloudinary
            });

            console.log('how  are  you  today')
            uploadedImages.push(result.secure_url); // Push the secure URL to the array
            console.log(uploadedImages)
        }
        console.log(uploadedImages)


        const newItem = new Item({
            Itemname,
            Description,
            Itemimgs: uploadedImages,
            AskingPrice: `${currency} ${AskingPrice}`,
            Userid: UserId,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);

    } catch (error) {
        console.error('Cloudinary Upload Failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Image upload to Cloudinary failed',
            error: error.message
        });
    }
}
// Update an item by ID
exports.updateItem = async (req, res) => {
    const { Itemname, Description, AskingPrice, currency } = req.body;
    const UserId = req.user ? req.user.id : req.body.userId;
    const id = req.params.id;
    console.log(id)

    // Validate the number of images
    if (req.files && req.files.images && req.files.images.length !== 3) {
        return res.status(400).json({
            success: false,
            message: 'You must upload 3 images.',
        });
    }

    let uploadedImages = [];
    try {
        // If images are provided, upload them to Cloudinary
        if (req.files && req.files.images) {
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            for (const file of files) {


                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    transformation: [
                        { width: 1000, crop: 'scale' },
                        { quality: 'auto:best' },
                        { fetch_format: 'auto' }
                    ],
                    folder: 'item_images' // Folder in Cloudinary
                });

                uploadedImages.push(result.secure_url); // Push the secure URL to the array
            }
        }

        // Prepare the updated data object
        const updateData = {
            Itemname,
            Description,
            AskingPrice: `${currency} ${AskingPrice}`,
            Userid: UserId,
            Itemimgs: uploadedImages.length > 0 ? uploadedImages : undefined // Only update images if new ones were uploaded
        };
        console.log(updateData);    

        // Update the item in the database
        const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true, overwrite: true });
        console.log(updatedItem)

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({success: true,data: updatedItem});
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({success: false,message: 'Failed to update item',error: error.message});
    }
};



exports.getUserItems = async (req, res) => {
    const UserId = req.user ? req.user.id : req.body.userId; // Get user ID from token or request body
    console.log(UserId);

    try {
        const items = await Item.find({ Userid: UserId }); // Find items with matching user ID

        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error('retrievind user itemss  failed:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve items', error: error.message });
    }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.verifyItem = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { status: 'verified' }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item verified successfully', updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.unverifyItem = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { status: 'unverified' }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item unverified successfully', updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


