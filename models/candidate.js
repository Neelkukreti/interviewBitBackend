const mongoose= require('mongoose');

const candidateSchema= new mongoose.Schema({

    email:{type:String},
    name:{type:String}
}

)

module.exports= Candidate= mongoose.model("candidate", candidateSchema);