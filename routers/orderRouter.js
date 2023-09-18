import express from 'express';
import mongoose from 'mongoose';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter=express.Router();

orderRouter.post(
    '/createOrder',
    isAuth,
    expressAsyncHandler(async (req,res) => {
        // console.log("Req------>",req)
        // console.log("Req OrderItems------>",req.body.orderItems)
        // console.log("Req OrderItems------>",req.body.orderItems.length)
        if(req.body.orderItems.length==0){
            res.status(400).send({message:"Cart is Empty"})
        }else{
            const order=new Order({
                orderItems:req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                shippingPrice: req.body.shippingPrice,
                itemPrice: req.body.itemPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.body.user,
            })
            const createdOrder=await order.save()
            res.status(201).send({message:"Order Created",orderDetail:createdOrder})
        }
    })
)

orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req,res) =>{
        try{
        const order =await Order.findById(req.params.id);
        if(order){
            res.send(order)
        }else{
            res.status(404).send({message:"Order Not Found"})
        }
    }catch(err){
        res.send({Error:err})
    }
    })
)

orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) =>{
        const order =await Order.find({})
        res.send(order)
    })
)

orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async(req,res) =>{
        console.log("Response----->",typeof(req.params.id))
        const order = await Order.findById(req.params.id)
        console.log("Order----->",order)
        if(order){
            order.isPaid= true,
            order.paidAt= Date.now();
            order.paymentResult={
                id: req.body.id,
                status: req.body.status,
                updated_time: Date.now(),
                email_address: req.body.email_address
            }
            const updatedOrder=await order.save();
            res.send({message:"Order Paid",order:updatedOrder});
        }else{
            res.status(404).send({message:"Order Not Found"});
        }
    })
)

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) =>{
        const order=await Order.findById(req.params.id)
        if(order){
            const deletedOrder=await Order.findByIdAndDelete(req.params.id)
            res.send({message:"Order Deleted",order:deletedOrder})
        }else{
            res.status(404).send("Order Not Found")
        }
    })
)

export default orderRouter;