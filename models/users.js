const mongoose = require ("mongoose");


const userSchema = mongoose.Schema(
    {

 
    username:String,
    email:String,
    password:String,
    role: {

    type: String,

    enum: ["user", "admin"],

    default: "user"

    },
    age:Number


    }
)

module.exports = mongoose.model("user", userSchema);