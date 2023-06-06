import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import cluster from "cluster";
import os from "os";
import { homePage, slowPage } from "./controllers/controller.js";

const Number_Of_CPU_Cors = os.cpus().length;
const app = express();


/** Middlewares **/
app.use(cors());
app.use(express.json());;
app.use(morgan('tiny'))
app.disable('x-powerd-by')   ///less hackers know about our stack


app.get('/', (req, res) => {
    res.send({
        status: "success",
        message: "Server Start-home page"
    })
})


if (cluster.isMaster) {

    console.log(`Master process ${process.pid} is running`);
    
    //fork workers.
    for (let i = 0; i < Number_Of_CPU_Cors; i++) {

        console.log(`Forking process worker ${i}...`);
        cluster.fork(); //creates new node js processes
    }
    
    cluster.on("exit", (worker, code, signal) => {

      console.log(`worker ${worker.process.pid} died`);
      cluster.fork(); //forks a new process if any process dies
    });

}
else {

   
    /*************Start server only when database connect sucessfully *****************/
    try {
        app.listen(3000, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Server is listening on http://localhost:3000`)
        })
    }
    catch (error) {
        console.log("can not connnect to the server!!");
    }

}


app.get('/homepage', homePage ) ;
app.get('/slowpage', slowPage ) ;