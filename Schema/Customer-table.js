const mongoose = require("mongoose")
const validator = require('validator');

const CustomerSchema = new mongoose.Schema({
    customer_id : {
        type : String,
        required : true
    },
    customer_name: {
        type : String,
        required : true
    },
    email:{
        type:String,
        required:true,
        unique : [true, "Email already exist!"],
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email")
            }
        }
        
    }
})

const Customer = mongoose.model("Customer", CustomerSchema)

module.exports = Customer