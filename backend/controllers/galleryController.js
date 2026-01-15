const ProgressPhoto = require('../models/ProgressPhoto');

const addPhoto = async (req, res) => {
    try {
        const { weight, notes } = req.body;
        let photoUrl = req.body.photoUrl;
        if (req.file) {
            photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const photo = await ProgressPhoto.create({
            user: req.user._id,
            photoUrl,
            weight,
            notes
        });
        res.status(201).json(photo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyPhotos = async (req, res) => {
    try {
        const photos = await ProgressPhoto.find({ user: req.user._id }).sort('-date');
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const photo = await ProgressPhoto.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        if (photo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await photo.deleteOne();
        res.json({ message: 'Photo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPhoto,
    getMyPhotos,
    deletePhoto
};
