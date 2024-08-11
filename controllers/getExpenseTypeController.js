const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');
const Users = require('../models/userModel');

const getExpenseTypeMonthWise = async (req, res) => {
    try {
        const userId = req.headers['user_id'];
        const { month, year } = req.body;
        const date_start = `${year}-${month}`;
        const year_start = year;
        console.log("User ID:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        const objectId = new mongoose.Types.ObjectId(userId);

        // Calculate the start and end dates for the month
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 1);

        // Calculate the start and end dates for the year
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const month_expenses = await Expenses.find({
            userid: objectId,
            date: { $gte: startOfMonth, $lt: endOfMonth }
        });
        
        console.log("Start Year:",startOfYear);
        console.log("End Year:",endOfYear);
        const year_expenses = await Expenses.find({
            userid: objectId,
            date: { $gte: startOfYear, $lt: endOfYear }
        });
        res.json({ month_expenses, year_expenses });

    } catch (err) {
        console.log("Error fetching expenses:", err);
        res.status(500).json({ error: 'Error fetching expenses', details: err.message });
    }
};


const getExpenseTypeYearWise=async(req,res)=> {
    try {
        const userId = req.headers['user_id'];
        const { year } = req.body;

        console.log("User ID:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        const objectId = new mongoose.Types.ObjectId(userId);

        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        
        console.log("Start Year:",startOfYear);
        console.log("End Year:",endOfYear);
        const year_expenses = await Expenses.find({
            userid: objectId,
            date: { $gte: startOfYear, $lt: endOfYear }
        });
        res.json({ year_expenses });

    } catch (err) {
        console.log("Error fetching expenses:", err);
        res.status(500).json({ error: 'Error fetching expenses', details: err.message });
    }
};


module.exports = {getExpenseTypeMonthWise,getExpenseTypeYearWise};
