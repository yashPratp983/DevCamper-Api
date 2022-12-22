const asyncHandler = require('../middleware/async');
const User = require('../models/users')
const path=require('path')
const ErrorResponse = require('../utils/errorResponse');


exports.getAllusers = asyncHandler(async (req, res, next) => {
    res.status(200).send(res.advancedResults);
})

exports.getOneUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    
    if(!user){
        next(new ErrorResponse(`No user exist with id ${req.params.id}`,401));
    }

    res.status(200).send({status:"success",user:user});
})

exports.createUser=asyncHandler(async(req,res,next)=>{
    const user=await User.create(req.body);

    res.status(201).send({status:"success",user:user});
})

exports.updateUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

    if(!user){
        next(new ErrorResponse(`No user exist with id ${req.params.id}`,401));
    }
      
    
    res.status(200).send({status:"success",user:user});
})

exports.deleteUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndDelete(req.params.id);

    if(!user){
        next(new ErrorResponse(`No user exist with id ${req.params.id}`,401));
    }
      
    
    res.status(200).send({status:"success",user:user});
})