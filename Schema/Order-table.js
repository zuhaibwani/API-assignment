const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    customer_id : {
        type : String,
        default : ""
    },
    inventory_id: {
        type : String,
        required : true
    },
    item_name:{
        type : String,
        required : true
    },
    quantity:{
        type : Number,
        required : true
    }
})

const Order = mongoose.model("Order", OrderSchema)

module.exports = Order