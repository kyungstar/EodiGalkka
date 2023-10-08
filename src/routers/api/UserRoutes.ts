import {Router} from "express";

import UserController from '../controller/User/UserController'

const router = Router();


// 회원가입
router.post("/join", UserController.userJoin);


export default router;