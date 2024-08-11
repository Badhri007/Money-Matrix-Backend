const express = require("express");
const { Router } = require('./routes/expenseRoute');
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Correctly configure CORS
app.use(cors({ origin: "https://money-matrix-frontend.vercel.app" }));
app.use(express.json());
app.use('/', Router);

mongoose.connect("mongodb+srv://Badhri007:Badlak717@money-matrix.0i3z4s6.mongodb.net/").then(() => {
    console.log("Mongo db connected..");
});

app.listen(5000, () => {
    console.log("Server started...");
});
