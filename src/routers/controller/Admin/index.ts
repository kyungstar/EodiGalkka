import {Router} from "express";
import Config from "../../../../config";

import AdminController from './AdminController'
import {jwtAuthCheck} from "../../../middlewares/JwtAuth";

const router = Router();



// 회원가입 ✓
router.post("/join", AdminController.adminJoin)

// 회원가입 ✓
router.post("/login", AdminController.adminLogin)

// 회원가입 신청 목록 ✓
router.post("/join/list", AdminController.joinList)

// 회원가입 승인 ✓
router.post("/join/accept", AdminController.joinAccept)

export default router;