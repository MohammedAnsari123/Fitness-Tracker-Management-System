const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addPhoto,
    getMyPhotos,
    deletePhoto
} = require('../controllers/galleryController');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getMyPhotos)
    .post(protect, upload.single('image'), addPhoto);

router.route('/:id').delete(protect, deletePhoto);

module.exports = router;
