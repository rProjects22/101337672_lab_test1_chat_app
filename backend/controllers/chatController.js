const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');
const config = require('../../config/config');

// Controller to handle sending group messages
exports.sendGroupMessage = async (req, res) => {
    const { from_user, room, message } = req.body;

    try {
        const newGroupMessage = new GroupMessage({
            from_user,
            room,
            message
        });
        await newGroupMessage.save();

        res.status(201).json({ message: 'Group message sent successfully' });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to handle sending private messages
exports.sendPrivateMessage = async (req, res) => {
    const { from_user, to_user, message } = req.body;

    try {
        const newPrivateMessage = new PrivateMessage({
            from_user,
            to_user,
            message
        });
        await newPrivateMessage.save();

        res.status(201).json({ message: 'Private message sent successfully' });
    } catch (error) {
        console.error('Error sending private message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
