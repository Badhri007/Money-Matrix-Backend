const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');

const getExpensesPagination = async (req, res) => {
    try {
        const pageNo = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const user_id = req.headers.user_id;

        const totalExpenses = await Expenses.find({ user_id }).countDocuments();
        const totalPages = Math.ceil(totalExpenses / pageSize);
        const expenses = await Expenses.find({ user_id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize);

        res.json({ expenses, totalPages });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

module.exports = { getExpensesPagination };
