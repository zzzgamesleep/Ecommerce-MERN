import mongoose from "mongoose";
export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect to DB success');
    } catch (error) {
        console.log('Connect to DB not success', error.message);
        process.exit(1);
    }
}