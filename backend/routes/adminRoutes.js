const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserFullData,
    deleteUser,
    getSystemStats,
    assignPlan,
    deletePlan
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/users/:id', protect, adminOnly, getUserFullData);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.post('/users/:id/plan', protect, adminOnly, assignPlan);
router.delete('/plans/:id', protect, adminOnly, deletePlan);
router.get('/stats', protect, adminOnly, getSystemStats);

module.exports = router;
