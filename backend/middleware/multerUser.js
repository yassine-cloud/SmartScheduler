const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const containner = process.env.CONTAINNER;
const usersFolder = "users";
const mainFolder = path.join(__dirname, `../${containner}`);
const allowedTypes = /jpeg|jpg|png/;

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = `${mainFolder}/${usersFolder}/`;

        // Check if the upload directory exists, if not, create it
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const image = `${Date.now()}.${file.originalname.split('.').pop()}`;
        req.body.image = `${usersFolder}/${image}`; // Add image to req.body
        // console.log('Image Path:', `${usersFolder}/${image}`);
        cb(null, image); // Rename file
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!', false);
    }
};

// Initialize upload with Multer
/**
 * upload for the user image
 */
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // Limit file size to 20MB
    fileFilter: fileFilter
});

module.exports = upload;