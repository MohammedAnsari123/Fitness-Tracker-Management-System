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

// @desc    Get conversation list (For Trainer Dashboard mostly)
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

        // Aggregate to find unique interlocutors
        // This is complex in Mongo without a separate Conversations model.
        // For getting started, we can assume:
        // - Trainers see their Clients.
        // - Clients see their Trainer.
        // We will fetch those lists instead of purely message-based history for now.

        if (myModel === 'Trainer') {
            // Return list of clients who have chatted OR just all clients?
            // Let's return all clients for now as potential chats.
            const clients = await User.find({ trainer: myId }).select('name email role');
            res.json(clients);
        } else {
            // Return my trainer
            const user = await User.findById(myId).populate('trainer', 'name email specialization');
            if (user.trainer) {
                res.json([user.trainer]);
            } else {
                res.json([]);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations
};
