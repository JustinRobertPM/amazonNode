import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import  Connection  from "./server/dataBase/db.js";
import express, { json } from "express";
import dotenv from 'dotenv';

dotenv.config();

const port=process.env.PORT || 5003 ;
const app=express();
app.use(json())
app.use(express.urlencoded({ extended: true }));
Connection();


app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);

console.log(process.env.PORT,".env working perfectly")
app.listen(port,()=> {
    console.log(`Server at http://localhost:${port}`)
})



