const express = require("express")
const mongoose = require("mongoose")
const app = express()
const InventoryModal = require("./Schema/Inventory-table")
const CustomerModal = require("./Schema/Customer-table")
const OrderModal = require("./Schema/Order-table")


app.use(express.json({limit: "30mb", extended:true}));
app.use(express.urlencoded({extended: false}));

// mongodb://127.0.0.1:27017/
mongoose.connect("mongodb://localhost:27017/api_web_tech_assignment", ()=>{
    console.log("Successfully connected to database.");
}, (e)=>{
    console.log(e);
})

app.listen(5000, (e)=>{
    if(e){
        console.log(e)
    }else{
        console.log("Listening to server on port 5000");
    }
})

//=================INVENTORY ROUTES=================

app.get("/inventory", async(req,res)=>{
   
    try{
        const allData = await InventoryModal.find()
        res.status(200).send(allData)
    }catch(e){
        res.status(400).send(e)
    }
})
    


app.post("/addinventory", async (req, res)=>{
    try{
        const addInventory = new InventoryModal(req.body)
        const newData = await addInventory.save()
        res.status(200).send(newData)
    }catch(e){
        res.status(400).send(e)
    }
})

//=================CUSTOMER ROUTES=================

app.get("/customers", async(req, res)=>{
    try{
        const allCustomerData = await CustomerModal.find()
        res.status(200).send(allCustomerData)
    }catch(e){
        res.status(400).send(e)
    }
})

app.post("/addcustomer", async(req, res)=>{
    try{
        const addCustomer = new CustomerModal(req.body)
        const newData = await addCustomer.save()
        res.status(200).send(newData)
    }catch(e){
        res.status(400).send(e)
    }
})

//=================ORDER ROUTES=================


app.post("/order", async(req, res)=>{
   try{
    const user = await CustomerModal.find({email : req.headers.authorization})
    if(user.length){
        const itemDetails = await InventoryModal.find({inventory_id : req.body.inventory_id})
        console.log(itemDetails)
        if(itemDetails[0].available_quantity >= req.body.quantity){
            let addOrder = new OrderModal({...req.body})
            addOrder.customer_id = user[0].customer_id
            const newData = await addOrder.save()
            const updatedQuantity = itemDetails[0].available_quantity - newData.quantity
            await InventoryModal.findOneAndUpdate({inventory_id : req.body.inventory_id}, {$set: {"available_quantity": updatedQuantity }})
            // console.log(newData)
            // console.log("Updated quantity = "+updatedQuantity)
            res.status(200).send(newData)
        }else{
            res.status(401).send("Out of Stock!")
        }
        

    }else{
        res.status(400).send("Unauthorized user!")
    }
   }catch(e){
        res.status(400).send(e)
   }
    
})

app.get("/order", async(req, res)=>{
    try{
        const allOrders = await OrderModal.find()
        res.status(200).send(allOrders)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get("/", (req, res)=>{
    res.status(200).send("API web tech assignment")
})