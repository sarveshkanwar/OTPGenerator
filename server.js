const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const User = require('./model/User')
const nodemailer = require('nodemailer');
require('dotenv').config();

///////////               111111111           ///////
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sarveshkanwar498@gmail.com",
        pass:process.env.PASS,
    }
})
mongoose.connect('mongodb://127.0.0.1:27017/RegisterOtp', { useNewUrlParser: true, useUnifiedTopology: true });

///////////////////////////////         2                                     ////////////////////
const storage = multer.diskStorage({
    destination:__dirname+"/uploads",
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
////////////////////////////////           3    ///////////////
const upload = multer({
    storage
});
 
////////////////////////////////              4    //////////////
const app = express();



app.set('view engine','hbs');
app.set('views','views')

app.use(express.urlencoded());
app.listen(3000,()=>{
    console.log("http://localhost:3000");
})


app.get('/',(req,res)=>{
    res.send("Welcome to Email verfication by Otp using NodeMailer");
})

app.get('/register',(req,res)=>{
    res.render("register");
})
///////////////////////////       5           ////////////////////
var email;
var Otp;

app.post('/register',upload.single('img'),async (req,res)=>{
    const file = req.file;
    const data = req.body;
    const newUser = new User(data);

    const newName= newUser._id+"."+file.mimetype.split("/")[1];
    const newPath = file.destination+"/"+newName;
    fs.renameSync(file.path,newPath);
    
    try{
        await newUser.save();
        email=newUser.email
        Otp=random();
        mail1()
        res.render("otp");
    }catch (error) {
        res.status(500).send("Error: " + error.message); // Sending the error message to the client
    }
})
////////////////////////           5////////////////////
app.post('/verify',async (req,res)=>{
    const data = req.body;
    const user = await User.findOne().where('email').equals(email);
    if(data.otp==Otp)
    {
        user.verified=true;
        await user.save();
        res.send("Success");
    }
    else   
        res.send("Failed");
})




function random() {
    var randomNumber = Math.floor(Math.random() * 9000) + 1000;
    console.log(randomNumber);
    return randomNumber;
}

////////////////////////////////666666666666666//////////
function mail1(){
    const mail = {
        from:"sarveshkanwar498@gmail.com",
        to:email,
        subject:'OTP Verification',
        text:`Your Otp is ${Otp}`,
    }
    transporter.sendMail(mail);
}
