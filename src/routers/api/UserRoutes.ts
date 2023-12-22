import {json, Router} from "express";

import UserController from '../controller/User/UserController';
import {JwtCheck} from "../../modules/SecurityAuth"


const router = Router();


// 회원가입 ✅
router.post("/join", UserController.userJoin);

// 고객 로그인 ✅
router.post("/login", UserController.userLogin);

// 고객 프로필 ✅
router.post("/profile", [JwtCheck], UserController.userProfile);

// 비밀번호 일치 여부 확인 ✅
router.post("/check/pwd", [JwtCheck], UserController.checkPwd);

// 전화번호 검증
router.post("/phone/check", [JwtCheck], UserController.getUserPhone);

// 이메일 검증
router.post("/email/check", [JwtCheck], UserController.getUserEmail);

// 회원정보 수정
router.post("/update", [JwtCheck], UserController.updateUserInfo);

// 임시비밀번호 발급 > 로그인까지 같이 작업할 것.
router.post("/temp/pwd", [JwtCheck], UserController.issueTempPwd);






export default router;