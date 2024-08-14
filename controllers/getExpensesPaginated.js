const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');

const getExpensesPagination = async (req, res) => {
    try {
        const pageNo = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

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

        const startIndex = (pageNo - 1) * pageSize;

        const expenses = await Expenses.find({ userid: objectId });

        // Flatten entries and transform to desired format
        const allEntries = [];
        expenses.forEach(expense => {
            expense.entry.forEach(entry => {
                allEntries.push({
                    entry_name: entry.name,
                    entry_amount: entry.amount,
                    entry_type: entry.expense_type,
                    date: expense.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                });
            });
        });

        const paginatedEntries = allEntries.slice(startIndex, startIndex + pageSize);
        const totalPages = Math.ceil(allEntries.length / pageSize);

        console.log(paginatedEntries);

        res.json({ entries: paginatedEntries, totalPages });

    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

module.exports = { getExpensesPagination };
