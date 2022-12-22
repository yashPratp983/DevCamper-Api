const {register,login,
    getLoggedInUser,
    resetPassword,
    resetPasswordToken,
    updatePassword,
    updateUserCredientials,
    logout
}=require('../controler/auth');

const express = require('express');
const {protect,authorize}=require('../middleware/auth')

const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect,getLoggedInUser)
router.route('/updatedetails').put(protect,updateUserCredientials);
router.route('/updatepassword').put(protect,updatePassword);
router.route('/forgotpassword').post(resetPassword)
router.route('/resetpassword/:resetToken').put(resetPasswordToken);
router.route('/logout').get(protect,logout);

module.exports=router;