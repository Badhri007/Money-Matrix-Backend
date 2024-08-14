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

        console.log("Fetching expenses for user:", objectId);
        const expenses = await Expenses.find({ userid: objectId });

        if (!expenses) {
            return res.status(404).json({ error: 'No expenses found for the user' });
        }

        // Flatten entries and transform to desired format
        const allEntries = [];
        expenses.forEach(expense => {
            if (expense.entries && Array.isArray(expense.entries)) {
                expense.entries.forEach(entry => {
                    allEntries.push({
                        entry_name: entry.name,
                        entry_amount: entry.amount,
                        entry_type: entry.expense_type,
                        date: expense.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                    });
                });
            } else {
                console.warn(`Expense with ID ${expense._id} has no entries or entries is not an array`);
            }
        });

        const paginatedEntries = allEntries.slice(startIndex, startIndex + pageSize);
        const totalPages = Math.ceil(allEntries.length / pageSize);

        console.log("Paginated entries:", paginatedEntries);

        res.json({ entries: paginatedEntries, totalPages });

    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

module.exports = { getExpensesPagination };


// const mongoose = require('mongoose');
// const Expenses = require('../models/expenseModel');

// const getExpensesPagination = async (req, res) => {
//     try {
//         const pageNo = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.pageSize) || 10;

//         const userId = req.headers['user_id'];
//         console.log("User ID:", userId);

//         if (!userId) {
//             return res.status(400).json({ error: 'User ID is required' });
//         }
//         let objectId;
//         if (mongoose.Types.ObjectId.isValid(userId)) {
//             objectId = new mongoose.Types.ObjectId(userId);
//         } else {
//             return res.status(400).json({ error: 'Invalid User ID format' });
//         }

//         const startIndex = (pageNo - 1) * pageSize;

//         const expenses = await Expenses.find({ userid: objectId });

//         // Flatten entries and transform to include the date of the expense
//         const allEntries = expenses.reduce((acc, expense) => {
//             const expenseDate = new Date(expense.date);
//             const formattedDate = expenseDate.toISOString().slice(0, 10); // YYYY-MM-DD

//             expense.entries.forEach(entry => {
//                 acc.push({
//                     entry_name: entry.entry_name,
//                     entry_amount: entry.entry_amount,
//                     entry_type: entry.entry_type,
//                     date: formattedDate,
//                 });
//             });

//             return acc;
//         }, []);

//         // Pagination
//         const totalEntries = allEntries.length;
//         const totalPages = Math.ceil(totalEntries / pageSize);
//         const paginatedEntries = allEntries.slice(startIndex, startIndex + pageSize);

//         res.json({ entries: paginatedEntries, totalPages });
//     } catch (error) {
//         console.error('Error fetching expenses:', error);
//         res.status(500).json({ error: 'An error occurred while fetching expenses' });
//     }
// };

// module.exports = { getExpensesPagination };
