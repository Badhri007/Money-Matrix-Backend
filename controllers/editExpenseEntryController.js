const mongoose = require('mongoose');
const Expenses = require('../models/expenseModel');

const editExpenseEntry = async (req, res) => {
    try {
        const { expense_id, entry_id, entry_name, entry_amount, entry_type, date } = req.body;
        console.log("Expense Entry:", expense_id, entry_id, entry_name, entry_amount, entry_type, date);

        // Find and update the expense entry
        const result = await Expenses.findOneAndUpdate(
            { _id: expense_id, 'entry._id': entry_id },
            {
                $set: {
                    'entry.$.name': entry_name,           // Match the schema field names
                    'entry.$.amount': entry_amount,
                    'entry.$.expense_type': entry_type,
                    'date': date                  // Ensure this field is part of the schema if needed
                }
            },
            { new: true } // Return the modified document
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Find the updated entry
        const updatedEntry = result.entry.find(entri => entri._id.toString() === entry_id);

        if (!updatedEntry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        // Format the updated entry
        const formattedEntry = {
            expense_id: result._id,
            entry_id: updatedEntry._id,
            entry_name: updatedEntry.name,
            entry_amount: updatedEntry.amount,
            entry_type: updatedEntry.expense_type,
            date: result.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
        };

        console.log(formattedEntry);

        res.status(200).json({ success: true, data: formattedEntry });

    } catch (error) {
        console.error('Error updating expense entry:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { editExpenseEntry };
