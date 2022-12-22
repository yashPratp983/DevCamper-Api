const asyncHandler = require('../middleware/async');
const geoCoder=require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp')
const path=require('path')
const ErrorResponse = require('../utils/errorResponse');
//@desc display all bootcamps
//@route /api/v1/bootcamps
//@access Private

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);

})

//@desc  create a bootcamps
//@route /api/v1/bootcamps
//@access Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
        req.body.user=req.user.id;
        const userBootcamp=await Bootcamp.findOne({user:req.body.user});

        if(userBootcamp && req.user.role!=='admin'){
          return next(new ErrorResponse(`User with id ${req.user.id} is not authorize to create more than one bootcamp`),403);
        }

        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).send({ status: "success", data: bootcamp });
    })

//@desc display a bootcamps with given id
//@route /api/v1/bootcamps/:id
//@access Private

exports.getOneBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.findById(req.params.id);
        if (!bootcamps) {
            return next(Error.Response(`Bootcamp not found with id ${req.params.id}`, 404));
        

        }
        res.status(200).send({ status: "success", data: bootcamps });


})

//@desc delete a bootcamp
//@route /api/v1/bootcamps/:id
//@access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.findById(req.params.id);
        if (!bootcamps) {
            return next(Error.Response(`Bootcamp not found with id ${req.params.id}`, 404));
        }

        if(req.user.id!==bootcamps.user && req.user.role!=='admin'){
          return next(new ErrorResponse('User not authorize to delete this bootcamp',404));
        }

        bootcamps.remove();
        res.status(200).send({ status: "success" });
   
})

//@desc Update a bootcamp
//@route /api/v1/bootcamps/:id
//@access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.findById(req.params.id)
        if (!bootcamps) {
          return next(Error.Response(`Bootcamp not found with id ${req.params.id}`, 404));
        }

        if(req.user.id!==bootcamps.user && req.user.role!=='admin'){
          return next(new ErrorResponse('User not authorize to update this bootcamp',404));
        }

        bootcamps=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        res.status(200).send({ status: "success", data: bootcamps });

})

//@desc Update a bootcamp
//@route /api/v1/bootcamps/:id
//@access Private

exports.getBootcampWithinradius = asyncHandler(async (req, res, next) => {
    const {zipcode,distance}=req.params;
    // Get lat/lng from geocoder
    const loc=await geoCoder.geocode(zipcode);

    const lat=loc[0].latitude;
    const lng=loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of earth
    // Earth radius=3963 miles/6378 km
    const radius=distance/3963;

    const bootcamps=await Bootcamp.find({
        location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
    });

    res.status(200).send({ status: "success", count:bootcamps.length,bootcamps: bootcamps });

})


// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if(req.user.id!==bootcamp.user && req.user.role!=='admin'){
    return next(new ErrorResponse('User not authorize to update this bootcamp',404));
  }


  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.undefined;
  console.log(file);

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});