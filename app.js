var express=require("express");
var mongoose=require("mongoose");
var app=express();
app.use(express.json());
require("dotenv").config();

var url="mongodb://0.0.0.0:27017/redbus";
mongoose.connect(url,{useNewUrlParser:true});
const con=mongoose.connection;
con.on('open',function()
{
    console.log("db connected");
});

app.get('/',(req,res)=>
{
    res.send("Welcome to RedBus Application");
});

const userRouter=require('./controller/user');
app.use('/user',userRouter);

const adminRouter=require('./controller/admin');
app.use('/admin',adminRouter);

app.listen(2727,()=>
{
    console.log("server is listening");
});