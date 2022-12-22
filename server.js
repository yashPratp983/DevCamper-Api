const express = require('express');
const dotenv = require('dotenv');
const path=require('path')
const bootcamps = require('./routes/bootcamp')
const connectDB = require('./config/db')
const Courses=require('./routes/courses')
// const logger = require('./middleware/logger')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const colors = require('colors');
const { Server } = require('http');
const errorHandler=require('./middleware/error')
const auth=require('./routes/auth')
const fileupload = require('express-fileupload');
const users=require('./routes/users');
const reviews=require('./routes/review');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors=require('cors');
const hpp=require('hpp');
const rateLimit=require('express-rate-limit');

dotenv.config({ path: './config/config.env' })

const app = express();
app.use(mongoSanitize());
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp())
app.use(cors());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses',Courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);
app.use(errorHandler);

connectDB();


const PORT = process.env.PORT || 5000;


app.listen(5000, (() => { console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold) }))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    Server.close(() => { process.exit(1) });
})