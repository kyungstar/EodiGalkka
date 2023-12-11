import {Router} from "express";

import FileController from '../controller/File/FileController';
import {JwtCheck} from "../../modules/SecurityAuth"


const router = Router();


// 사진 업로드 > 파일 타입 추가하기
router.post("/img/upload", [JwtCheck], FileController.imgUpload);

// 영상 업로드
router.post("/mov/upload", [JwtCheck], FileController.movUpload);

// Seq로 다운로드
router.get("/downloadSeq", [JwtCheck], FileController.imgDownloadBySeq);

// 경로로 파일 다운로드
router.get("/downloadPath", [JwtCheck], FileController.imgDownloadByPath);



export default router;