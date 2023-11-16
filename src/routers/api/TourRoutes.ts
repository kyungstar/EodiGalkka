import {json, Router} from "express";

import TourController from '../controller/Tour/TourController';
import {JwtCheck} from "../../modules/middlewares/SecurityAuth"


const router = Router();



// 지구본 목록
router.post("/earth/list", [JwtCheck], TourController.earthList);

// 대륙 목록
router.post("/continents/list", [JwtCheck], TourController.continentsList);

// todo
// 나라 목록
router.post("/country/list", [JwtCheck], TourController.countryList);

// 도시 목록
router.post("/city/list", [JwtCheck], TourController.cityList);

// 패키지 목록
router.post("/crawler", [JwtCheck], TourController.crawlerList);


export default router;