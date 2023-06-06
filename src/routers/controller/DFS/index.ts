import {Router} from "express";
import Config from "../../../../config";
import FileController from './FileController'
import express from "express";
const router = express.Router();

/**File**/
// 이미지 업로드
router.post("/img/upload", FileController.imageUpload);

// 이미지 다운로드
router.get("/img/download", FileController.imageDown);



export default router;