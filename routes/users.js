const {getAllusers,getOneUser,updateUser,createUser,deleteUser}=require('../controler/users')
const User=require('../models/users')

const advancedResults = require('../middleware/advancedResults');

const express = require('express');
const {protect,authorize}=require('../middleware/auth')

const router=express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User),getAllusers).post(createUser);
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);

module.exports=router;