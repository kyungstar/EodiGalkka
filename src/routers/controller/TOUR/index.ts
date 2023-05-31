import {Router} from "express";
import express from "express";
const router = express.Router();

import Config from "../../../../Config";

import TourController from "../TOUR/TourController";
import BoardController from "../TOUR/BoardController";




/**File**/
// 대륙 리스트
router.post("/world/list", TourController.world);

// 세계 리스트
router.post("/continents/list", TourController.continents);

// 도시 리스트
router.post("/country/list", TourController.country);

// 네이버최저가 도시 리스트
router.post("/mod/country/list", TourController.crawlerCountry);



export default router;