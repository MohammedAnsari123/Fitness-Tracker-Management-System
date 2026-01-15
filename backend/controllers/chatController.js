const Message = require('../models/Message');
const User = require('../models/User');
const Trainer = require('../models/Trainer');

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, receiverModel, message } = req.body;

        let senderId, senderModel;

        // Determine sender based on who is logged in (User or Trainer)
        if (req.user) {
            senderId = req.user._id;
            senderModel = 'User';
        } else if (req.trainer) {
            senderId = req.trainer._id;
            senderModel = 'Trainer';
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newMessage = await Message.create({
            senderId,
            senderModel,
            receiverId,
            receiverModel,
            message
        });

        // Real-time Socket Emitting
        const io = req.app.get('io');
        // Emit to the receiver's room (which uses their ID)
        io.to(receiverId).emit('receive_message', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages between current user and another person
// @route   GET /api/chat/:otherId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { otherId } = req.params;
        let myId;

        if (req.user) {
            myId = req.user._id;
        } else if (req.trainer) {
            myId = req.trainer._id;
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Find messages where (sender is ME and receiver is OTHER) OR (sender is OTHER and receiver is ME)
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherId },
                { senderId: otherId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation list (History + Assigned)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        let myId, myModel;
        if (req.user) {
            myId = req.user._id;
            myModel = 'User';
        } else if (req.trainer) {
            myId = req.trainer._id;
            myModel = 'Trainer';
        }

        // 1. Get Distinct Interlocutors from Message History
        const messages = await Message.find({
            $or: [{ senderId: myId }, { receiverId: myId }]
        });

        const distinctIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() === myId.toString()) {
                distinctIds.add(msg.receiverId.toString());
            } else {
                distinctIds.add(msg.senderId.toString());
            }
        });

        const distinctIdsArray = Array.from(distinctIds);

        // Fetch details for these IDs from both Collections
        const historyUsers = await User.find({ _id: { $in: distinctIdsArray } }).select('name email role');
        const historyTrainers = await Trainer.find({ _id: { $in: distinctIdsArray } }).select('name email role specialization');

        // Combined History List
        let allConversations = [
            ...historyUsers.map(u => ({ ...u.toObject(), type: 'User' })),
            ...historyTrainers.map(t => ({ ...t.toObject(), type: 'Trainer' }))
        ];

        // 2. Add Assigned Connections (even if no messages yet)
        if (myModel === 'Trainer') {
            const clients = await User.find({ trainer: myId }).select('name email role');
            const clientsWithRole = clients.map(c => ({ ...c.toObject(), type: 'User' }));
            allConversations = [...allConversations, ...clientsWithRole];
        } else {
            const user = await User.findById(myId).populate('trainer', 'name email specialization');
            if (user.trainer) {
                // Check if already in list to avoid duplicates
                const exists = allConversations.find(c => c._id.toString() === user.trainer._id.toString());
                if (!exists) {
                    allConversations.push({ ...user.trainer.toObject(), type: 'Trainer' });
                }
            }
        }

        // Deduplicate by ID
        const uniqueConversations = Array.from(new Map(allConversations.map(item => [item._id.toString(), item])).values());

        res.json(uniqueConversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search for users and trainers
// @route   GET /api/chat/search?query=...
// @access  Private
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        let myId;
        if (req.user) myId = req.user._id;
        else if (req.trainer) myId = req.trainer._id;

        const regex = new RegExp(query, 'i');

        // Search Users
        const users = await User.find({
            $and: [
                { _id: { $ne: myId } },
                { $or: [{ name: regex }, { email: regex }] }
            ]
        }).select('name email role');

        // Search Trainers
        const trainers = await Trainer.find({
            $and: [
                { _id: { $ne: myId } },
                { $or: [{ name: regex }, { email: regex }] }
            ]
        }).select('name email specialization role');

        const results = [
            ...users.map(u => ({ ...u.toObject(), type: 'User' })),
            ...trainers.map(t => ({ ...t.toObject(), type: 'Trainer' }))
        ];

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    searchUsers
};
