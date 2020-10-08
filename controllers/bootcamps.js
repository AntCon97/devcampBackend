// get all 
// get /api/v1/bootcamps
// access: public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: 'true',
        msg: 'show all bootcamps',
    });
}

// get single
// get /api/v1/bootcamps/:id
// access: public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: 'true',
        msg: `Get bootcamp ${req.params.id}`,
    });
}

// create bootcamp
// post /api/v1/bootcamps
// access: private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: 'true',
        msg: 'create new bootcamps',
    });
}

// update single
// put /api/v1/bootcamps/:id
// access: private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: 'true',
        msg: `Update bootcamp ${req.params.id}`,
    });
}

// Delete single
// Delete /api/v1/bootcamps/:id
// access: private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: 'true',
        msg: `Delete bootcamp ${req.params.id}`,
    });
}