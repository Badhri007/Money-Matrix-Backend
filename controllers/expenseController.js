const mongoose = require('mongoose');
const Expenses = require("../models/expenseModel");

const storeExpenses = async (req, res) => {
  try {
    let { user_id, date, entry } = req.body;

    // Ensure user_id is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const data = new Expenses({ userid: user_id, date, entry });

    const updatedExpenses = await data.save();
    res.json(updatedExpenses);
  } catch (err) {
    res.status(500).json({ error: 'Error saving expense data', details: err.message });
  }
};

// const getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expenses.find();
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching expenses', details: err.message });
//   }
// };

module.exports = { storeExpenses };
