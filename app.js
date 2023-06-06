import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import cluster from "cluster";
import os from "os";
import router from "./routers/routes.js";

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

app.use( '/api/v1' , router );

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
        app.listen(process.env.PORT, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Server is listening on http://localhost:${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log("can not connnect to the server!!");
    }

}


