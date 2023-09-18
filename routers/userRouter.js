import express from 'express';
import exprssAsyncHandler from 'express-async-handler';
import { generateToken,isAuth } from '../utils.js';
import User from '../models/userModel.js';
import bycrpt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const userRouter=express.Router();

userRouter.post(
    '/register',
    exprssAsyncHandler(async (req,res)=> {
        //console.log("req ------>"+JSON.stringify(req))
        const user= new User({
            name: req.body.name,
            email: req.body.email,
            password: bycrpt.hashSync(req.body.password,8)
        })
        const createdUser= await user.save();
        res.send({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
                token: generateToken(createdUser),
        })
    })
)

userRouter.get(
    '/:id',
    expressAsyncHandler(async(req,res) =>{
        const user= await User.findById(req.params.id)
        if(user){
            res.send(user)
        }else{
            res.status(404).send({message:"User Not Found"})
        }
    })
)

userRouter.get(
    '/',
    expressAsyncHandler(async(req,res) =>{
        const user= await User.find({})
        if(user){
            res.send(user)
        }else{
            res.status(404).send({message:"No Data Found"})
        }
    })
)

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req,res)=> {
        const user=await User.findOne({email: req.body.email})
        if(user){
            if (bycrpt.compareSync(req.body.password,user.password)){
                res.send({
                    id:user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token:generateToken(user)
                })
            }else{
                res.status(401).send({message:"Invalid Email or Password"})
            }
        }else{
            res.status(401).send({message:"Invalid Email"})
        }
    })
)

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req,res)=>{
        const user= await User.findById(req.user.id)
        if(user){
            user.name= req.body.name || user.name;
            user.email= req.body.email ||user.email;
            if (req.body.password){
                user.password=bycrpt.hashSync(req.body.password,8)
            }
            user.isAdmin=req.body.isAdmin
            const updatedUser= user.save()
            res.send({
                name:updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token:generateToken(updatedUser)})
        }
    })
)

userRouter.post(
    '/mail',
    expressAsyncHandler(async (req,res)=>{
        console.log("Rout is Working")
        const transporter=nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:'justinpm96@gmail.com',     //process.env.PORT,
                pass:'eqecjomqbgubyvfq'  //process.env.PASS,
            }
        });

        const mailOptions = {
            from: 'justinpm96@gmail.com',
            to: 'justinrobertpm58@gmail.com',
            subject: 'Hello from Nodemailer',
            text: 'This is a test email sent using Nodemailer.',
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              res.send("Nodemailer Error")
            } else {
              console.log('Email sent:', info.response);
              res.send(info.response)
            }
          });

    })
)


export default userRouter;

