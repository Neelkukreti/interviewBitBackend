const mongoose= require('mongoose');

const interviewerSchema= new mongoose.Schema({

    email:{type:String},
    name:{type:String}  
}

)

module.exports= Interviewer= mongoose.model("interviewer", interviewerSchema);