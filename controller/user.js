const express=require("express");
const router=express.Router();
const user=require('../model/userdb');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth=require("../auth/auth");

router.post('/register',async(req,res)=>
{
    try{
        const result=await user.find({email:`${req.body.email}`});
        if (!(req.body.name && req.body.age && req.body.gender && req.body.contact && req.body.pwd && req.body.cpwd )) 
        {
            res.send("All inputs are required");
        }
        else if(req.body.pwd != req.body.cpwd)
        {
            res.send("Password and Confirm Password must be same.");
        }
        else if(result.length==0)
        {
            var obj=new user({
                name:req.body.name,
                age:req.body.age,
                gender:req.body.gender,
                contact:req.body.contact,
                email:req.body.email,
                pwd:req.body.pwd
            });
            var encrypted=await bcrypt.hash(req.body.pwd,10);
            obj.pwd=encrypted;
            await obj.save();
            res.send("User successfully registered !!");
        }
        else
        {
            res.send("User with this Email is already Exist..Please Login");
        }
    }
    catch(err)
    {
        res.send(err);
    }

});

router.post('/login',async(req,res)=>
{
    try{
        var {email,pwd}=req.body;
        const obj=await user.findOne({email:`${email}`});
        if(obj!=null && await bcrypt.compare(pwd, obj.pwd) )
        {
            var id=obj._id;
            const token = jwt.sign(
                {email,id},
                process.env.TOC,
                {
                  expiresIn: "2h",
                }
              );
              console.log(token);
            res.send(`Welcome ${obj.name}\n Token : ${token}`);
        }
        else if(obj!=null)
        {
           res.send("Incorrect Password");
        }
        else
        {
            res.send("User with this email does not exist.Please Register!!");
        }
    }
    catch(err)
    {
        res.send(err);
    }
});

router.post('/profile',auth,async(req,res)=>
{
    const obj=await user.findOne({email:`${req.user}`});
    res.send(obj);
});






module.exports=router;