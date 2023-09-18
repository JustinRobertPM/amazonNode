import mongoose from "mongoose";

const Connection= async (Username , Password) => {
    const URL= 'mongodb://127.0.0.1:27017/customerproduct'
    try{
        await mongoose.connect(URL,{useUnifiedTopology: true, useNewUrlParser : true})
        console.log('Mongodb customerproduct connected successfully')
    }catch(error){
        console.log('Error while connecting to the database',error)
    }
};

export default Connection;