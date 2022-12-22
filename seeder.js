const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Bootcamp=require('./models/Bootcamp');
const courses=require('./models/course')
const Users=require('./models/users')
const Reviews=require('./models/Reviews')
const colors=require('colors');

dotenv.config({path:'./config/config.env'});

mongoose.connect(process.env.db_url);

// Read JSON files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamp.json`,'utf-8'));
const course=JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`,'utf-8'))
const user=JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`,'utf-8'))
const review=JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`,'utf-8'))
// Import into DB
const importData=async()=>{
    try{
        await Bootcamp.create(bootcamps);
        console.log('Data imported...'.green.inverse);
        process.exit();
    }catch(err){
        console.error(err);
    }
}

// Delete data
const deleteData=async()=>{
    try{
        await Bootcamp.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    }catch(err){
        console.error(err);
    }
}

const addCourses=async()=>{
try{
await courses.create(course);
console.log('Courses imported'.green.inverse);
process.exit();

}catch(err){
console.log(err);
}
}

const addReview=async()=>{
    try{
    await Reviews.create(review);
    console.log('Reviews imported'.green.inverse);
    process.exit();
    
    }catch(err){
    console.log(err);
    }
    }

const addUser=async()=>{
    try{
    await Users.create(user);
    console.log('Users imported'.green.inverse);
    process.exit();
    
    }catch(err){
    console.log(err);
    }
    }

const deleteCourses=async ()=>{
try{
await courses.deleteMany();
console.log('Courses deleted'.red.inverse);
process.exit;
}catch(err){
    console.log(err);
}
}

const deleteReviews=async ()=>{
    try{
    await Reviews.deleteMany();
    console.log('Reviews deleted'.red.inverse);
    process.exit;
    }catch(err){
        console.log(err);
    }
    }

const deleteUsers=async ()=>{
    try{
    await Users.deleteMany();
    console.log('Users deleted'.red.inverse);
    process.exit;
    }catch(err){
        console.log(err);
    }
    }

if(process.argv[2]==='-i'){
    importData();
    addCourses();
    addUser();
    addReview();
}else if(process.argv[2]==='-d'){
    deleteData();
    deleteCourses();
    deleteUsers();
    deleteReviews();
}
