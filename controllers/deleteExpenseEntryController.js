const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');

const deleteExpenseEntry = async (req, res) => {
    try {
        const { expense_id, entry_id } = req.body;
        console.log("Expense ID:", expense_id, "Entry ID:", entry_id);

        // Retrieve the document to show entries before deletion
        const expense = await Expenses.findById(expense_id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const allEntriesBefore = expense.entry.map(entry => ({
            expense_id: expense._id,
            entry_id: entry._id,
            entry_name: entry.name,
            entry_amount: entry.amount,
            entry_type: entry.expense_type,
            date: expense.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
        }));

        console.log("Before Deletion:", allEntriesBefore);

        // Find and update the expense entry
        const updatedExpense = await Expenses.findOneAndUpdate(
            { _id: expense_id },
            {
                $pull: {
                    entry: { _id: new mongoose.Types.ObjectId(entry_id) }  // Remove the entry with the specified entry_id
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Format the remaining entries
        const allEntriesAfter = updatedExpense.entry.map(entry => ({
            expense_id: updatedExpense._id,
            entry_id: entry._id,
            entry_name: entry.name,
            entry_amount: entry.amount,
            entry_type: entry.expense_type,
            date: updatedExpense.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
        }));

        console.log("After Deletion:", allEntriesAfter);

        res.status(200).json({ success: true, data: allEntriesAfter });

    } catch (error) {
        console.error('Error deleting expense entry:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { deleteExpenseEntry };
