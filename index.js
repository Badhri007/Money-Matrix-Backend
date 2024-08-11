// const express = require("express");
// const { Router } = require('./routes/expenseRoute');
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Correctly configure CORS
// app.use(cors({ origin: "https://money-matrix-frontend.vercel.app" }));
// app.use(express.json());
// app.use('/', Router);

// mongoose.connect("mongodb+srv://Badhri007:Badlak717@money-matrix.0i3z4s6.mongodb.net/").then(() => {
//     console.log("Mongo db connected..");
// });

// app.listen(5000, () => {
//     console.log("Server started...");
// });
const express = require("express");
const { Router } = require('./routes/expenseRoute');
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Correctly configure CORS
const corsOptions = {
    origin: "https://money-matrix-frontend.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://money-matrix-frontend.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use('/', Router);

mongoose.connect("mongodb+srv://Badhri007:Badlak717@money-matrix.0i3z4s6.mongodb.net/")
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

app.listen(5000, () => {
    console.log("Server started on port 5000...");
});
