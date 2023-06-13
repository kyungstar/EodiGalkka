import {Router} from "express";
import Config from "../../../../config";

import AgencyController from './AgencyController'
import {jwtAuthCheck} from "../../../middlewares/JwtAuth";

const router = Router();



// 회원가입 ✓
router.post("/join", AgencyController.agencyJoin);

// 회원가입 ✓
router.post("/login", AgencyController.agencyLogin);

// 이메일 중복검사 ✓
router.post("/user/email/check", AgencyController.userEmail)

// 전화번호 중복검사 ✓
router.post("/user/phone/check", AgencyController.userPhone)





export default router;