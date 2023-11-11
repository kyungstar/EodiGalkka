import {json, Router} from "express";

import TourController from '../controller/Tour/TourController';
import {JwtCheck} from "../../modules/middlewares/SecurityAuth"


const router = Router();


// todo

// 지구본 목록
router.post("/earth/list", [JwtCheck], TourController.earthList);
// 지구본 상세
router.post("/earth/detail", [JwtCheck], TourController.earthDetail);


// 세계 목록
router.post("/world/list", [JwtCheck], TourController.worldList);

// 세계 상세
router.post("/world/detail", [JwtCheck], TourController.worldDetail);

// 세계 목록
router.post("/country/list", [JwtCheck], TourController.countryList);
// 세계 상세
router.post("/country/detail", [JwtCheck], TourController.countryDetail);


// todo
/*
// 대륙 목록
router.post("/continents/list", [JwtCheck], TourController.continentsList);
// 대륙 상세
router.post("/continents/detail", [JwtCheck], TourController.continentsDetail);
*/

export default router;