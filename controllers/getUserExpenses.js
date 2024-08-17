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

        // const expenses = await Expenses.find({ userid: objectId });


        const allEntries = [];
        expenses.forEach(expense => {
            let expenseId = new mongoose.Types.ObjectId(expense._id);
            expense.entry.forEach(entry => {
                let entryId = new mongoose.Types.ObjectId(entry._id);
                allEntries.push({
                    expense_id:expenseId,
                    entry_id:entryId,
                    entry_name: entry.name,
                    entry_amount: entry.amount,
                    entry_type: entry.expense_type,
                    date: expense.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                });

            });
        });
        
        res.json(allEntries);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses', details: err.message });
    }
};



module.exports = { getUserExpenses };
