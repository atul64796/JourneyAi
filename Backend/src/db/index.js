import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"


const connectDb = async () =>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_DB_URI}${DB_NAME}`)
        console.log(`MongpDb connected! DB HOST: ${conn.connection.host}`);
    } catch (error) {
        console.log("MOngoDb connection errors:",error)
        process.exist(1);
    }
}

export default connectDb;