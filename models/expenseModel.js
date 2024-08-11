// expenseModel.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: Number },
  expense_type:{type:String},
});

const expenseSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: { type: Date, default: Date.now },
  entry: { type: [entrySchema] } ,
});

const Expenses = mongoose.model('Expenses', expenseSchema);

module.exports = Expenses;
