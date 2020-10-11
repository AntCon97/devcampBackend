const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');



// get all 
// get /api/v1/bootcamps
// access: public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query;
        // copy req.query create query string create operators 
        const reqQuery = { ...req.query};

        //fields to exclude 
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // loop over remove fields and delete
        removeFields.forEach(param => delete reqQuery[param]);
        
        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // find resources and executing query
        query = Bootcamp.find(JSON.parse(queryStr));

        //select fields 
        if(req.query.select){
          const fields = req.query.select.split(',').join(' ');
          query = query.select(fields);
        }

        //sort 
        if(req.query.sort){
          const sortBy = req.query.sort.split(',').join(' ');
          query = query.sort(sortBy);
        }else {
          query = query.sort('-createdAt');
        }

        //Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.params.limit, 10) || 25;
        const startIndex = (page - 1) * limit; 
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const bootcamps = await query;

        //pagination result 
        const pagination = {};

        if(endIndex < total){
          pagination.next = {
            page: page +1,
            limit
          }
        }

        if(startIndex> 0){
          pagination.prev = {
            page: page -1,
            limit
          }
        }

        res.status(200).json({ success: true,count: bootcamps.length, pagination, data: bootcamps});
});

// get single
// get /api/v1/bootcamps/:id
// access: public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
      

        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp});
   
})

// create bootcamp
// post /api/v1/bootcamps
// access: private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
   
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
   
    
})

// update single
// put /api/v1/bootcamps/:id
// access: private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp })
    
})

// Delete single
// Delete /api/v1/bootcamps/:id
// access: private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: {} })
})

// get bootcamps within a radius
// get /api/v1/bootcamps/radius/:zipcode/:distance
// access: private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
      
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});