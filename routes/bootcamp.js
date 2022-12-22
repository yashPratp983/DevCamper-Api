const express = require('express');
const router = express.Router();
const { getBootcamps, createBootcamp, getOneBootcamp, deleteBootcamp, updateBootcamp,getBootcampWithinradius,uploadFile} = require('../controler/bootcamp.js');
const courses=require('./courses');
const reviews=require('./review')
const Bootcamp=require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
const {protect,authorize}=require('../middleware/auth')

router.use('/:bootcampId/courses',courses);
router.use('/:bootcampId/reviews',reviews);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp);
router.route('/:id').get(getOneBootcamp).put(protect,authorize('publisher','admin'),updateBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampWithinradius);
router.route('/:id/photo').put(protect,authorize('publisher','admin'),uploadFile);

module.exports = router;
