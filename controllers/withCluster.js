import cluster from "cluster";
import os from "os";
import app from "../app";

const Number_Of_CPU_Cors = os.cpus().length;


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

    /******************** With OUT Cluster request handling time **********************/
    app.get('/homepageWithCluster', homePageWithCluster);
    app.get('/slowpageWithCluster', slowPageWithCluster);


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

async function homePageWithCluster(req, res) {
    res.send({
        status: "success",
        message: "Home page"
    })
}

async function slowPageWithCluster(req, res) {

    try {
        let result = 0;
        for (let i = 0; i < 5000000000; i++) {
            result = result + i;
        }

        return res.status(200).send({
            status: "success",
            sum: result,
            message: "slow page"
        })
    }
    catch (error) {
        return res.status(404).send({ error })
    }

}