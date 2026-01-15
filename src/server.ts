import {Server} from "http"
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

let server: Server;

const PORT = 3000;
const mongoDB_connection_string: string = process.env.MONGODB_CONNECTION_STRING as string;

export default function main(){
    try{
        const connection = mongoose.connect(mongoDB_connection_string);

        console.log("Mongoose is connected!");
        
        server = app.listen(PORT, () => {
            console.log("This server is running on port ", PORT);
        })
    }catch(err){
        console.log(err)
    }
}

main();