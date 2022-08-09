const express=require("express");
const router=express.Router();
const user=require('../model/userdb');
const bcrypt=require("bcryptjs");

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
            //console.log(obj);
            res.send("User with this Email is already Exist..Please Login");
        }

    }
    catch(err)
    {
        res.send(err);
    }

});






module.exports=router;