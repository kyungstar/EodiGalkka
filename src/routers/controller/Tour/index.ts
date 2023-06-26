import {Router} from "express";
import express from "express";
const router = express.Router();

import Config from "../../../../config";

import TourController from "./TourController";
import BoardController from "./BoardController";
import TravelController from "./TravelController";
import {jwtAuthCheck} from "../../../middlewares/JwtAuth";




/**File**/
// 대륙 리스트
router.post("/world/list", [jwtAuthCheck], TourController.world);
// 세계 리스트
router.post("/continents/list", [jwtAuthCheck], TourController.continents);


// --------------------------------------------------------------------
// 나라 리스트
router.post("/country/list", [jwtAuthCheck], TourController.country);
// 네이버최저가 나라 리스트
router.post("/mod/country/list", [jwtAuthCheck], TourController.crawlerCountry);

// --------------------------------------------------------------------

// 도시 리스트
router.post("/city/list", [jwtAuthCheck], TourController.cityList);

// --------------------------------------------------------------------

// 여행 리스트
router.post("/travel/list", [jwtAuthCheck], TravelController.travelList);
// 인기있는 여행 리스트
router.post("/travel/popular/list", [jwtAuthCheck], TravelController.popularTravleList);




// 투어 여행글 작성하기 -----------------------------------------------------

// 투어 여행글 작성하기 ✓
router.post("/board", [jwtAuthCheck], BoardController.boardWrite);
// 투어 여행글 수정하기
router.post("/board/update", [jwtAuthCheck], BoardController.boardUpdate);
// 투어 여행글 삭제하기
router.post("/board/delete", [jwtAuthCheck], BoardController.boardDelete);
// 투어 여행글 목록 조회하기 ✓
router.post("/board/list", [jwtAuthCheck], BoardController.boardList);

// 투어 여행글 상세 조회하기 (조회시 조회수 증가) ✓
router.post("/board/detail", [jwtAuthCheck], BoardController.boardDetail);



// 투어 여행글 좋아요 누르기 (싫어요는 없다.)
router.post("/board/like", [jwtAuthCheck], BoardController.boardLike);
// 투어 여행글 댓글 남기기 (조회시 조회수 증가)
router.post("/board/reply", [jwtAuthCheck], BoardController.boardReply);

// todo 목록
// 투어 여행글 신고하기
router.post("/board/report", [jwtAuthCheck], BoardController.boardReport);


// 신고하기 기능 작업 필요함.

export default router;