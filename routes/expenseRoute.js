const Router = require('express').Router();

const Users = require('../models/userModel')
const bcrypt=require('bcryptjs')

const { storeExpenses } = require('../controllers/expenseController')

const {storeUsers} = require('../controllers/userSignupController')

const { verify } = require('../middleware/middleware');
const { decodeBase64 } = require('bcryptjs');
const {getUserExpenses}=require('../controllers/getUserExpenses')


const {getExpenseTypeMonthWise,getExpenseTypeYearWise}=require('../controllers/getExpenseTypeController');

Router.post('/storeExpenses', verify, storeExpenses)

Router.post('/storeUser',verify,storeUsers)

Router.get('/getExpenses',getUserExpenses);


Router.post('/getExpenseTypeMonthWise',getExpenseTypeMonthWise);
Router.post('/getExpenseTypeYearWise',getExpenseTypeYearWise);


Router.post('/checkUser',async(req,res)=>{
    console.log("Request:",req.body);
    const {email:userEmail,password}=req.body;
    console.log(userEmail);
    console.log(password);
    
    const user = await Users.findOne({ email: userEmail });

    if (user && await bcrypt.compare(password, user.password)) {
        return res.status(200).json({ success: true, userId: user._id });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

})






module.exports = { Router }

