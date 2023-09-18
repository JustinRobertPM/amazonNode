import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';


const productRouter=express.Router();

productRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) => {
        const product=new Product({
            name: 'Sample Name' + Date.now(),
            image: '2wCEAAoHCBYWFRgVFRYYGBgZGhgYGhoaGBoYGhoYGRgZGhkYGBocIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzYrJCs0NDQ2NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP',
            price: 1000,
            category:'sample category',
            brand: 'samble brand',
            countInStock:6,
            rating:0,
            numReviews: 0,
            description: 'sample description',
        })
        const createdProduct=await product.save();
        res.send({ message: 'Product Created', product: createdProduct })
    })
)

productRouter.get(
    '/:id',
    expressAsyncHandler(async (req,res) =>{
        const product=await Product.findById(req.params.id)
        if(product){
            res.send({product})
        }else{
            res.status(404).send({message:"Product Not Found"})
        }
    })
)

productRouter.get(
    '/',
    expressAsyncHandler(async (req,res) =>{
        const product=await Product.find({});
        if(product){
        res.send({product})
        }else{
            res.status(404).send({message:"No Product Found"})
        }
    })
)

productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) =>{
        const product=await Product.findById(req.params.id)
        if(product){
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.image = req.body.image || product.image;
            product.category = req.body.category || product.category;
            product.brand = req.body.brand || product.brand;
            product.countInStock = req.body.countInStock  || product.countInStock;
            product.description = req.body.description || product.description;
            const updatedProduct = await product.save();
            res.send({ message: 'Product Updated', product: updatedProduct });
        }else{
            res.status(404).send({message:"No Product Found"})
        }
    })
)

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async(req,res) =>{
        const product=await Product.findById(req.params.id)
        if(product){
            const deletedProduct=await Product.findByIdAndRemove(req.params.id);
            res.send({message:"Product Deleted",Product:deletedProduct});
        }else{
            res.status(404).send({message:"Product Not Found"});
        }
    })
)


export default productRouter;

