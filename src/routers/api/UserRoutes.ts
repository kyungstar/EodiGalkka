import {json, Router} from "express";

import UserController from '../controller/User/UserController';
import {JwtCheck} from "../../modules/middlewares/SecurityAuth"


const router = Router();


// 회원가입
router.post("/join", UserController.userJoin);

// 고객 프로필
router.post("/profile", [JwtCheck], UserController.userProfile);


// 비밀번호 일치 여부 확인
router.post("/profile", [JwtCheck], UserController.checkPwd);

// 전화번호 검증
router.post("/phone/check", [JwtCheck], UserController.getUserPhone);

// 이메일 검증
router.post("/email/check", [JwtCheck], UserController.getUserEmail);

// 회원정보 수정
router.post("/email/check", [JwtCheck], UserController.userProfile);

// 임시비밀번호 발급
router.post("/profile", [JwtCheck], UserController.issueTempPwd);


// todo 임시비밀번호일 경우, 비밀번호 바꾸라고 하기
// 고객 로그인
router.post("/login", UserController.userLogin);




export default router;