import {json, Router} from "express";

import UserController from '../controller/User/UserController';
import {JwtCheck} from "../../modules/middlewares/SecurityAuth"


const router = Router();


// 회원가입
router.post("/join", UserController.userJoin);

// 고객 로그인
router.post("/login", UserController.userLogin);

// 고객 프로필
router.post("/profile", [JwtCheck], UserController.userProfile);



export default router;