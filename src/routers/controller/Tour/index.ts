import {Router} from "express";
import express from "express";
const router = express.Router();

import Config from "../../../../config";

import TourController from ".//TourController";
import BoardController from ".//BoardController";
import TravelController from "./TravelController";




/**File**/
// 대륙 리스트
router.post("/world/list", TourController.world);

// 세계 리스트
router.post("/continents/list", TourController.continents);


// --------------------------------------------------------------------

// 나라 리스트
router.post("/country/list", TourController.country);

// 네이버최저가 나라 리스트
router.post("/mod/country/list", TourController.crawlerCountry);

// --------------------------------------------------------------------

// 도시 리스트
router.post("/city/list", TourController.cityList);

// --------------------------------------------------------------------

// 여행 리스트
router.post("/travel/list", TravelController.travelList);

// 인기있는 여행 리스트
router.post("/travel/popular/list", TravelController.popularTravleList);

export default router;