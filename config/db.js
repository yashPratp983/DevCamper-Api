const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.db_url)

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;