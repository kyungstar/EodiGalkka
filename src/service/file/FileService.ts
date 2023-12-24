import fs from "fs";
import multer from "multer";
import dayjs from "dayjs";
import {v4 as uuid} from "uuid";

import Logger from "../../modules/Logger";
import Config from "../../../config";

import sharp from "sharp";
import {error} from "winston";
import {Request, Response} from "express";

const targetSizeInMB = 10; // 목표 파일 크기 (10MB)

// todo : Low Quert > TypeOrm 변경하기

export default class FileService {


    public static async movUpload(res: Response, imgData: any): Promise<[boolean, string, any?]> {

        try {

            if (Config.FILE.MOV_FILE_SIZE < imgData.file.size) {
                return [false, "영상 용량 초과."];
            }


            const nowDate = dayjs().format("YYYYMMDD");

            const dir = Config.FILE.PATH + "/" + imgData.fileDir + "/" + nowDate;


            if (!fs.existsSync(dir)) {
                // 디렉토리가 없다면, 상위 디렉터리까지 함께 생성
                fs.mkdirSync(dir, {recursive: true});
            }

            const originFileName = imgData.file.originalFilename;
            const newFileName = uuid().split("-").join('').replace(/-/g, '');

            // 확장자 구하기
            const extension = originFileName.substr(originFileName.lastIndexOf(".") + 1);
            const filePath = dir + "/";
            const fileName = newFileName + "." + extension;

            const movSize = imgData.file.size;


            // 업로드할 영상의 크기와 타입을 제한하는 설정을 만듭니다.
            const storage = multer.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, filePath);
                },
                filename: (req, file, callback) => {
                    callback(null, fileName);
                },
            });


            const upload = multer({storage: storage}).single("file");

            upload(imgData.file, res, (err) => {
                if (err) {
                    return [false, err.message];
                }

                // 파일을 직접 저장합니다.
                fs.writeFileSync(filePath, imgData.file.path);

            });

            let fileObj: any = {
                file_path: dir + "/",
                file_name: fileName + "." + extension,
                file_size: movSize,
                extension: extension,
                user_id: imgData.userId
            };


/*
            const fileData: number = await DBHelper_B.insert("file_info", {
                file_path: dir + "/",
                file_name: fileName,
                file_size: movSize,
                extension: extension,
                user_id: imgData.userId
            });

            if (!fileData)
                return [false, "영상 업로드 실패", null];*/

            return [true, "영상 업로드 성공", {fileData: fileObj}]


        } catch (err) {
            Logger.error("movUpload" + err);
            return [false, "이미지 업로드 실패", null];
        }
    }

    public static async uploadImg(imgData: any): Promise<[boolean, string, any?]> {

        try {


            if (Config.FILE.IMG_FILE_SIZE < imgData.file.size) {
                return [false, "이미지 용량 초과."];
            }


            const nowDate = dayjs().format("YYYYMMDD");

            const dir = Config.FILE.PATH + "/" + imgData.fileDir + "/" + nowDate;

            if (!fs.existsSync(dir)) {
                // 디렉토리가 없다면, 상위 디렉터리까지 함께 생성
                fs.mkdirSync(dir, {recursive: true});
            }

            const originFileName = imgData.file.originalFilename;
            const newFileName = uuid().split("-").join('').replace(/-/g, '');

            // 확장자 구하기
            const extension = originFileName.substr(originFileName.lastIndexOf(".") + 1);
            const filePath = dir + "/";
            const fileName = newFileName + "." + extension;
            const thumbFileName = newFileName + "_thumb." + extension;

            const imgSize = imgData.file.size;

            try {
                const metadata = await sharp(imgData.file.path).metadata();

                fs.renameSync(imgData.file.path, filePath + fileName);
                await sharp(filePath + fileName).resize(metadata.width, metadata.height).toFile(filePath + fileName + "_thumb." + extension);

                await sharp(filePath + fileName + "_thumb." + extension).metadata();
            } catch (err) {
                Logger.info(err.message);
                return [false, "이미지 업로드 실패", null];
            }

/*

            const fileData: number = await DBHelper_B.insert("file_info", {
                file_path: dir + "/",
                file_name: fileName,
                file_size: imgSize,
                thumb_path: filePath,
                thumb_name: thumbFileName,
                extension: extension,
                user_id: imgData.userId
            });




            if (!fileData)
                return [false, "이미지 업로드 실패", null];

            fileObj.file_seq = Number(fileData);
*/

            let fileObj: any = {
                file_path: dir + "/",
                file_name: fileName + "." + extension,
                file_size: imgSize,
                thumb_path: filePath,
                thumb_name: thumbFileName,
                extension: extension,
                user_id: imgData.userId
            };

            return [true, "이미지 업로드 성공", {fileData: fileObj}]


        } catch (err) {
            Logger.error("uploadImg" + err);
            return [false, "이미지 업로드 실패", null];
        }
    }


    public static async getFilePath(imgData: any): Promise<[boolean, string, any?]> {

        try {

          /*  const fileData = await DBHelper_B.findOne("file_info", {file_seq: imgData.fileSeq});

            if (!fileData)
                return [false, "이미지 다운로드 실패"];

            if (!fs.existsSync(fileData.file_path + fileData.file_name)) {
                return [false, "이미지 다운로드 실패"];
            }

            const imgSavePath = fileData.file_path + fileData.file_name;

            // 이미지 경로를 return하기
            return [true, "이미지 다운로드 성공", imgSavePath];
*/
        } catch (err) {
            Logger.error("getFilePath" + err);
            return [false, "이미지 업로드 실패"];
        }
    }


    public static async getFileByFilePath(imgData: any): Promise<[boolean, string, any?]> {

        try {

            if (!fs.existsSync(imgData.filePath)) {
                return [false, "이미지 다운로드 실패"];
            }

            // 이미지 경로를 return하기
            return [true, "이미지 다운로드 성공", imgData.filePath];

        } catch (err) {
            Logger.error("getFilePath" + err);
            return [false, "이미지 다운로드 실패"];
        }
    }

}



