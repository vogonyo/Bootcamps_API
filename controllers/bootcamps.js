const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');

//@desc Get All Bootcamps
//@route GET api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler( async(req, res, next) => {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });   
});

//@desc Get Single Bootcamp
//@route GET api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler( async(req, res, next) => {
    
      const bootcamp = await Bootcamp.findById(req.params.id);

      if(!bootcamp){
          return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
      }
      res.status(200).json({ success: true, data: bootcamp});   
});

//@desc Create new Bootcamp
//@route POST api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler( async (req, res, next) => {
      const bootcamp = await Bootcamp.create(req.body);

      res.status(201).json({
          success: true,
          data: bootcamp
      });
    
});

//@desc Update Single Bootcamp
//@route PUT api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler( async(req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }
       
        res.status(200).json({ success: true, data: bootcamp});
    
});

//@desc Delete Single Bootcamp
//@route DELETE api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }
         
        res.status(200).json({ success: true, data: {}})
    
    
});

//@desc Get Bootcamps within radius
//@route GET api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler( async (req, res, next) => {
  const { zipcode, distance} = req.params;

//Get Latitude and Longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //Divide dist by radius of Earth
  //Earth Radius = 3963 miles or 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat ], radius ]}}
  });
   
  res.status(200).json({
      success: true,
      
  });

});