const errorResponse=require('../utils/errorResponse');
const errorHandler=(err,req,res,next)=>{
    let error={...err};
    error.message=err.message;
    console.log(err,error)
    if(err.name==='CastError'){
        const message=`Bootcamp not found with id ${err.value}`;
        error=new errorResponse(message,404);
    }
    if(err.code===11000){
        const message=`Duplicate field value entered`;
        error=new errorResponse(message,404);
    }
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new errorResponse(message,404);
    }
    console.log(err.stack.red)
    res.status(error.statusCode|| 500).send({status:false,error:error.message|| 'Server Error'});

}

module.exports=errorHandler;