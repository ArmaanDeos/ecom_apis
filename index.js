const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')
const cors = require("cors");

dotenv.config();

app.use(cors());
// ? The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 
app.use(express.json());


// ? DB Connection
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB Connection Successful!")
})
.catch((err)=>{
    console.log(err)
})




// ! EndPoints
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/api/orders", orderRouter)






// ? Listen on port
app.listen(PORT,()=>{
    console.log(`Backend Server Running! ${PORT}`);
})

