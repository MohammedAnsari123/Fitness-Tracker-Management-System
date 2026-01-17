const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserFullData,
    deleteUser,
    getSystemStats,
    assignPlan,
    deletePlan,
    updateUserSubscription,
    updateUserSubscription,
    toggleBlockUser,
    getAllTrainers,
    approveTrainer,
    toggleSuspendTrainer
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserFullData);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', toggleBlockUser);
router.post('/users/:id/plan', assignPlan);
router.put('/users/:id/subscription', updateUserSubscription);
router.delete('/plans/:id', deletePlan);
router.get('/stats', getSystemStats);

router.get('/trainers', getAllTrainers);
router.put('/trainers/:id/approve', approveTrainer);
router.put('/trainers/:id/suspend', toggleSuspendTrainer);

module.exports = router;
