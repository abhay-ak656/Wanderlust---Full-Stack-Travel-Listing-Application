const expressError = require('../expreeserror/expresserror.js');
const User = require('../Model/user.js');
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const signupform = (req, res) => {
    res.render('./users/singup.ejs');
};

const signup = async (req, res) => {
    let { email, username, password } = req.body;
    let registeruser = await User.register(new User({ email, username }), password);
    req.login(registeruser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "User register Successfully");
        res.redirect('/listing');
    })
};

const loginform = (req, res) => {
    res.render('./users/login.ejs');
};

const loginvalidation = async (req, res) => {
    const redirect = res.locals.redirectUrl || '/listing';
    req.flash('success', "Welcome back in wanterlust");
    res.redirect(redirect);
};

const Logout = (req, res) => {

    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', "you succssfully logout from wanterlust");
        res.redirect('/listing');
    });
};

const favlist=async (req,res)=>{
    let favlist=await User.findById(req.user._id).populate('fav');
    if(favlist.fav.length==0){
       throw new expressError(404,"Your wishlist is empty");
    }
       let userfav=req.user?req.user.fav:[];
    res.render('listing/index.ejs',{list:favlist.fav,userfav});
}

const forgotrequest=(req,res)=>{
     let isuser=false;
     let token=0;
    res.render('users/forgotpassword.ejs',{isuser,token});
}

let transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'abhay.ak201@gmail.com',
      pass:process.env.Google_App_Password
    }
})

const forgotpassword=async (req,res)=>{
    let {email}=req.query;
    let user=await User.findOne({email:email});
    if(!user){
       return res.json({status:'error',message:`there is no ${email} exist in database please singup first`});
    }
    
    let token=crypto.randomBytes(20).toString('hex');
    let hashedtoken=crypto.createHash('sha256').update(token).digest('hex');

    user.resettokens=hashedtoken;
    user.resetexpires=Date.now()+10*60*1000;

    await user.save();
   let base_url=process.env.BASE_URL;
  let resetlink=`${base_url}/listing/user/reset-password/${hashedtoken}`;

    let mailOption={
        from:'abhay.ak201@gmail.com',
        to:email,
        subject:"Reset your password",
        html:`<p><b>hi${user.username}</b>,</p>
              <p>you requested a password reset,Click the bellow link to reset the password</p>
              <p><a href=${resetlink}>Reset password</a><br>this reset link valid for 10 minutes</p>
              <p>If you didn't request a password reset, please ignore this email.</p>
              <p>Best regards,<br>Abhay Team</p>`
    }

   try{
    transport.sendMail(mailOption);
    console.log("send the email successfully to",email);
   }catch(err){
      console.log(err);
     return res.json({status:'error',message:"there was something error to send the mail"});
   }
  res.json({status:'success',message:`For reset the password, the reset link share to ${email}`});
}

const resetpasswordform=async(req,res)=>{
    let {token}=req.params;
    let user=await User.findOne({
        resettokens:token,
        resetexpires:{$gt:Date.now()}
    })

if(!user){
    req.flash('error',"Token expired or invalid,please try again");
   return res.redirect('/listing/user/forgotrequest')
}
 let isuser=true;
 res.render('users/forgotpassword.ejs',{isuser,token});
}

const resetpassword=async (req,res)=>{
    let {token}=req.params;
    let {password}=req.body;
    let user=await User.findOne({resettokens:token,
        resetexpires:{$gt:Date.now()}})

if(!user){
    req.flash('error',"Token expired or invalid,please try again");
   return res.redirect('/listing/user/forgotrequest')
}

await user.setPassword(password);
user.resettokens=undefined;
user.resetexpires=undefined;
let result=await user.save();
console.log(result);
req.flash("success",`${password} is set as New password`);
res.redirect('/listing/user/login');
}
module.exports = {
    signup,
    signupform,
    loginform,
    loginvalidation,
    Logout,
    favlist,
    forgotrequest,
    forgotpassword,
    resetpasswordform,
    resetpassword
}