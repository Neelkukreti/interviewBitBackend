const mongoose= require('mongoose');

const interviewSchema= new mongoose.Schema({

    date: { type: String},
    timeStart: {type: String},
    timeEnd: {type:String},
    candidate:{type:String},
    candidateName:{type:String},
    interviewer:{type: String},
    interviewerName:{type:String}
}

)

module.exports= Interview= mongoose.model("interview", interviewSchema);