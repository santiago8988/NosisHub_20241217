import mongoose from "mongoose";

const connectToDB = async () =>{
    if(mongoose.connections[0].readyState){
        return true
    }
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
        return true;
    } catch (error) {
        console.log(error)
    }
}

export default connectToDB