const express=require("express");
const router=express.Router();
const user=require('../model/userdb');
const admin=require('../model/admindb');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth=require("../auth/auth");

router.post('/login',async(req,res)=>
{
    try{
        var {username,password}=req.body;
        const obj=await admin.findOne({username:`${username}`});
        if(obj!=null && await bcrypt.compare(password, obj.password) )
        {
            var id=obj._id;
            const token = jwt.sign(
                {username,id},
                process.env.TOC,
                {
                  expiresIn: "2h",
                }
              );
              console.log(token);
            res.send(`Welcome Admin\n Token : ${token}`);
        }
        else if(obj!=null)
        {
           res.send("Incorrect Password");
        }
        else
        {
            res.send("Invalid Admin Username");
        }
    }
    catch(err)
    {
        res.send(err);
    }
});

router.post('/viewUsers',auth,async(req,res)=>
{
    const obj=await user.find();
    res.send(obj);
});






module.exports=router;
