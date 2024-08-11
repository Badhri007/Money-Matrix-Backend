const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');

const getUserExpenses = async (req, res) => {
    try {
        const userId = req.headers['user_id'];
        console.log("User ID:", userId);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        let objectId;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            objectId = new mongoose.Types.ObjectId(userId);
        } else {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }

        const expenses = await Expenses.find({ userid: objectId });
        console.log("Fetched Expenses:", expenses);
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses', details: err.message });
    }
};

module.exports = { getUserExpenses };
