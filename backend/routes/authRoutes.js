const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    registerTrainer,
    loginTrainer,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/trainer/register', registerTrainer);
router.post('/trainer/login', loginTrainer);
router.get('/me', protect, getMe);

module.exports = router;
