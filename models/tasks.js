const mongoose = require ("mongoose");


const userTask = mongoose.Schema(
    {

 
     taskName:String,
    description:String,
    completed:Boolean,
    
   project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
    },


    }
)

module.exports = mongoose.model("task", userTask);