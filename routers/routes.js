import { Router } from "express";
import { homePage, slowPage } from "../controllers/controller.js";

const router = Router();

router.get('/homepage', homePage ) ;
router.get('/slowpage', slowPage ) ;

export default router ;