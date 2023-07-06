const jwt=require('jsonwebtoken')
require('dotenv').config();
const key = process.env.SECRET_KEY;

 let otpverify=(req,res,next)=>{
    let token=req.headers.authorization.split(' ')[1];
    
    if(token){
        let decoded=jwt.verify(token,key);
       // console.log(decoded)
        if(decoded.Useremail){
            req.body.Useremail=decoded.Useremail;
          //  console.log(req.body);
            next();
        }  
}
 }
module.exports=otpverify