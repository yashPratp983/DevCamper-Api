const mongoose = require('mongoose');

const connectDB = async () => {
    try{
    const conn = await mongoose.connect(process.env.db_url)

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;
