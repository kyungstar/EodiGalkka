import {Router} from "express";

import FileController from '../controller/File/FileController';
import {JwtCheck} from "../../modules/middlewares/SecurityAuth"


const router = Router();


// 사진 업로드 > 파일 타입 추가하기
router.post("/img/upload", [JwtCheck], FileController.imgUpload);

// 사진 다운로드
router.get("/img/download", [JwtCheck], FileController.imgDownload);

// 파일 경로 획득하기

// 영상 업로드
router.post("/mov/upload", [JwtCheck], FileController.movUpload);

// 영상다운로드
router.get("/mov/download", [JwtCheck], FileController.movUpload);

export default router;