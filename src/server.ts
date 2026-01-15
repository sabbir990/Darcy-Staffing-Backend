import {Server} from "http"
import app from "./app";

let server: Server;

const PORT = 3000;

export default function main(){
    try{
        server = app.listen(PORT, () => {
            console.log("This server is running on port ", PORT);
        })
    }catch(err){
        console.log(err)
    }
}

main();