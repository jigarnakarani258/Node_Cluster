import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import { homePageWithOutCluster, slowPageWithOutCluster } from "./controllers/withOutCluster.js";

const app = express();

app.use(cors());

/** Middlewares **/
app.use(express.json());;
app.use(morgan('tiny'))
app.disable('x-powerd-by')   ///less hackers know about our stack


app.get('/', (req, res) => {
    res.send({
        status: "success",
        message: "Server Start-home page"
    })
})

/******************** With OUT Cluster request handling time **********************/
app.get('/homepage', homePageWithOutCluster ) ;
app.get('/slowpage', slowPageWithOutCluster ) ;


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


export default app ;