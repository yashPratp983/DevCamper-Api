const asyncHandler = require('../middleware/async');
const Review = require('../models/Reviews')
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        if(!reviews){
            return next(new ErrorResponse('Reviews not found with given bootcamp id',400));
        }
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  });

exports.getAReview=asyncHandler(async(req,res,next)=>{
    const review=await Review.findById(req.params.id);
    
    if(!review){
        next(new ErrorResponse(`No review with if ${req.params.id}`,404));
    }

    res.status(200).json({success:true,data:review});
})  

exports.addReview=asyncHandler(async(req,res,next)=>{
    const bootcampId=req.params.bootcampId;
    const userId=req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }

    req.body.bootcamp=bootcampId;
    req.body.user=userId;
    const review=await Review.create(req.body);

    res.status(200).json({success:true,data:review});
})

exports.updateReview=asyncHandler(async(req,res,next)=>{
  let review=await Review.findById(req.params.id);

  if(!review){
    return next(new ErrorResponse(`Review not found with id ${req.body.params}`,401));
  }

  if(req.user.id!==review.user.toString() && req.user.role!=='admin'){
    return next(new ErrorResponse(`Not authorize to update review with id ${req.params.id}`,403));
  }

  review=await Review.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })

  res.status(200).json({success:true,data:review});

})

exports.deleteReview=asyncHandler(async(req,res,next)=>{
  let review=await Review.findById(req.params.id);

  if(!review){
    return next(new ErrorResponse(`Review not found with id ${req.body.params}`,401));
  }

  if(req.user.id!==review.user.toString() && req.user.role!=='admin'){
    return next(new ErrorResponse(`Not authorize to delete review with id ${req.params.id}`,403));
  }

  review=await Review.findById(req.params.id)
  review.remove();

  res.status(200).json({success:true});
})