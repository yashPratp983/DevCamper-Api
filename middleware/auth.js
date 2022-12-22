const jwt=require('jsonwebtoken');
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('./async');
const User=require('../models/users');

exports.protect=asyncHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')){
        token=req.headers.authorisation.split(' ')[1];
    }
    else if(req.cookies.token){
        token=req.cookies.token;
    }

    if(!token){
        next(new ErrorResponse('Not authorize to access the route',401))
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        console.log(decoded);

        req.user=await User.findById(decoded.id);

        next();

    }catch(err){
     
        next(new ErrorResponse('Not authorize to access the route',401))   
    }
})

exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
          return next(new ErrorResponse(`User with ${req.user.role} role is not authorize to access this route`,403))
        }
        next();
    }
}

