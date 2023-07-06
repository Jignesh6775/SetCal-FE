const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../Models/UserModel');
const { UserOTP } = require('../Models/otp.model');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config();
const key = process.env.SECRET_KEY;

module.exports = userRouter;

userRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {

        //Check user is present or not
        const isUserPresent = await UserModel.findOne({ email });
        if (isUserPresent) {
            return res.status(400).send({ message: 'User already exists' });
        }

        if (isUserPresent.length == 0) {
            //Hashing password
            bcrypt.hash(password, 5, async (err, hash) => {
                const user = new UserModel({ name, email, password: hash })
                await user.save();
                res.status(201).send({ message: 'User Register Successfully' });
            })

            //otp generation;
            let OTP = otpGenerator.generate(6, {
                upperCaseAlphabets: true,
                specialChars: true
            });
            let otp = new UserOTP({ Useremail: email, otp: OTP, createdAt: new Date(), expiresAt: new Date + 300000 });
            otp.save();  // saving the otp in backend

            let tokenOTP = jwt.sign({ 'Useremail': email }, key) // token genration to pass unique email for verification through otp
            sendOTPforverification(email, OTP);  //  sending email

            res.status(200).send({ message: 'Please verify your email', "token": tokenOTP })
        }
        else {
            if (user[0].verify) {
                res.status(400).send({ msg: "user already exist please Login!" })
            } else {
                res.status(400).send({ msg: "user already exist please verify your email !" })
            }
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
})


userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //Check user is present or not
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'User does not exists' });
        }
        //Check password is correct or not
        else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                const token = jwt.sign({ userID: user._id }, key, { expiresIn: '7d' });
                res.status(200).send({ message: 'Login Successfully', token, userdetails: user });
            }
            else {
                res.status(400).send({ message: 'Password is incorrect' });
            }
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }

})

userRouter.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;

    const user = await UserModel.find({ email: Useremail });
    const databaseotp = await UserOTP.find({ Useremail });
    try {
        if (otp == databaseotp[0].otp) {
            await UserModel.findByIdAndUpdate(user[0]._id, { verify: true });
            await UserOTP.deleteMany({ Useremail });
            res.status(200).json({ msg: "Email verified" });
        } else {
            res.status(200).json({ msg: "Wrong otp !" });
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }

})


userRouter.post("logout", async (req, res) => {
    let token=req.headers.authorization.split(" ")[1];
    
     let blacklisttoken=await new BlacklistingModel({btoken:token});
     blacklisttoken.save();
     res.status(200).json({msg:"Logout Successfully"});
})



const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.email',
    port: 587,
    secure: false,
    auth: {
        user: 'lawlink.legal.services@gmail.com',
        pass: 'qzroppedvawxedzh'
    }
});


function sendOTPforverification(email, otp) {
    transporter
        .sendMail({
            from: "lawlink.legal.services@gmail.com",
            to: email,
            subject: "Here is your OTP for DigiTron Login",
            html: `<!DOCTYPE html>
       <html>
         <head>
           <title>Example Email Template</title>
           <meta charset="utf-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         </head>
         <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #333; padding: 20px;">
           <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-collapse: collapse;">
             <tr>
               <td style="background-color: #0077c0; text-align: center; padding: 10px;">
                 <h1 style="font-size: 28px; color: #fff; margin: 0;">DigiTron</h1>
               </td>
             </tr>
             <tr>
               <td style="padding: 20px;">
                 <h2 style="font-size: 24px; color: #0077c0; margin-top: 0;">OTP for DigiTron Login : ${otp}</h2>
                 <p style="margin-bottom: 20px;">Thank you for choosing DigiTron</p>
                 <p style="margin-bottom: 0;">Best regards,</p>
                 <p style="margin-bottom: 20px;">DigiTron</p>
                 <p style="margin-bottom: 20px;">Let's change our tommorrow...</p>
               </td>
             </tr>
           </table>
         </body>
       </html>`
        })
        .then(() => {
            console.log("mail sent succesfully")
        })
        .catch((err) => {
            console.log(err)
        })
}


function sendemailrestlink(email, link) {
    transporter
        .sendMail({
            from: "lawlink.legal.services@gmail.com",
            to: email,
            subject: "Here is your link to reset your password",
            html:
                `<!DOCTYPE html>
       <html>
         <head>
           <title>Example Email Template</title>
           <meta charset="utf-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         </head>
         <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #333; padding: 20px;">
           <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-collapse: collapse;">
             <tr>
               <td style="background-color: #0077c0; text-align: center; padding: 10px;">
                 <h1 style="font-size: 28px; color: #fff; margin: 0;">DigiTron</h1>
               </td>
             </tr>
             <tr>
               <td style="padding: 20px;">
                 <h2 style="font-size: 24px; color: #0077c0; margin-top: 0;">Link for resetting your password <a href=${link}> link</a></h2>
                 <p style="margin-bottom: 20px;">Thank you for choosing DigiTron</p>
                 <p style="margin-bottom: 0;">Best regards,</p>
                 <p style="margin-bottom: 20px;">DigiTron</p>
                 <p style="margin-bottom: 20px;">Let's change our tommorrow...</p>
               </td>
             </tr>
           </table>
         </body>
       </html>`
        })
        .then(() => {
            console.log("mail sent succesfully")
        })
        .catch((err) => {
            console.log(err)
        })
}


module.exports = { userRouter };