require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dwzigf8jj',
    api_key: '112798421542136',
    api_secret: 'GQ45Ro_swGxJrh7HNeIfpaxBv9k'
});

module.exports = cloudinary;