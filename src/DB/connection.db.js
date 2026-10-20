import { MongoClient } from "mongodb";
import { DB_NAME, MONGO_URI } from "../Config/config.js";

const client = new MongoClient(MONGO_URI)

export const db = client.db(DB_NAME)

export const connectDB = async() => {
    try {
        await client.connect()
        console.log(`DB Connected Successfully`);
        
    } catch (error) {
        console.log(`DB Failed to Connect, ${error}`);
    }
}