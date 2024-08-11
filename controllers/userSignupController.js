const Users=require('../models/userModel')
const bcrypt=require('bcryptjs')

const storeUsers=async(req,res)=>{
    try{
        console.log("Storing User..");
        const {username,email,password}=req.body;
        console.log("Backend:",username,email,password);
        const hashed_password= await bcrypt.hash(password,10);
        console.log("After hashing:",username,email,hashed_password);
        const data = new Users({username,email,password:hashed_password});
        const updatedUsers=await data.save();
        res.json(updatedUsers)
    }
    catch(err)
    {
        res.json(err);
    }
}

module.exports={storeUsers}