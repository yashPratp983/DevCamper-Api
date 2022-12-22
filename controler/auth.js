const asyncHandler = require('../middleware/async');
const User = require('../models/users')
const path=require('path')
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto=require('crypto');

exports.register = asyncHandler(async (req, res, next) => {
    const user=await User.create(req.body);
    sendTokenResponse(user,200,res);
    
})

exports.login = asyncHandler(async (req, res, next) => {
    const {email,password}=req.body;
    const user=await User.findOne({email}).select('+password')

    if(!user){
        next(new ErrorResponse('Invalid Crediantials',401));
    }

    const matchPassword=await user.matchPassword(password);

    if(!matchPassword){
        next(new ErrorResponse('Invalid Crediantials',401));
    }

    sendTokenResponse(user,200,res);

})

const sendTokenResponse = (user, statusCode, res) => {
    const token=user.getSignedJwtToken();

    const options={
        expires:new Date(
            Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true
    }

    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }

    res.status(statusCode).cookie('token',token,options).send({status: "success",token});
}

exports.getLoggedInUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user);

    res.status(200).send({status:"success",user:user});
})



exports.resetPassword=asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
    })

exports.resetPasswordToken=asyncHandler(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorResponse('Not authorize to reset password',400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendTokenResponse(user,200,res);

})

exports.updateUserCredientials=asyncHandler(async (req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user.id,req.body,{new:true,runValidators:true})

    res.status(200).send({
        status:"success",
        data:user
    })
})

exports.updatePassword=asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    sendTokenResponse(user, 200, res);

})

exports.logout=asyncHandler(async (req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })

    res.status(200).send({status:"success",data:{}})
})