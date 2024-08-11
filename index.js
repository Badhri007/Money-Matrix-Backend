const express = require("express")
const { Router } = require('./routes/expenseRoute')
const mongoose = require("mongoose");


const app = express()
const cors = require("cors");

app.use(cors())
app.use(express.json())
app.use('/', Router);


mongoose.connect("mongodb://0.0.0.0:27017/Expense-Tracker").then(() => {
    console.log("Mongo db connected..")
});

app.listen(5000, () => {
    console.log("Server started 123...");
})