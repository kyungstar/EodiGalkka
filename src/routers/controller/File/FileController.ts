import {Request, Response} from "express";
import fs from "fs";

import DataValiator from "../../../service/DataValiator";
import ResHandler from "../ResHandler";

import {
    imgUploadSchema,
    imageInterface,
    imgDownSchema
} from "../../../repositories/FileEntity";
import FileService from "../../../service/file/FileService";
import Logger from "../../../modules/Logger";


class FileController extends ResHandler {

    public imgUpload = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, imgUploadSchema),
                DataValiator.checkString(['file', "fileDir", "fileType"])
            ) as imageInterface;

            const checkResult = DataValiator.checkResult(data);


            if (!checkResult) {
                return this.validErr(res);
            }

            const [imgUploadResult, imgUploadCode, imgData] = await FileService.uploadImg(data);

            if (imgUploadResult)
                this.true(imgUploadCode, res, imgData);
            else
                this.false(imgUploadCode, res);


        } catch (err) {
            this.err(err, res);
        }

    }

    public imgDownloadBySeq = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, imgDownSchema),
                DataValiator.checkNumber(['fileSeq'])
            ) as imageInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [imgDownResult, imgDownCode, imgSavePath] = await FileService.getFilePath(data);

            if (!imgDownResult)
                this.false(imgDownCode, res);

            res.download(imgSavePath);

        } catch (err) {
            this.err(err, res);
        }

    }


    public imgDownloadByPath = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, imgDownSchema),
                DataValiator.checkString(['filePath'])
            ) as imageInterface;

            const checkResult = DataValiator.checkResult(data);


            if (!checkResult) {
                return this.validErr(res);
            }

            const [imgDownResult, imgDownCode, imgSavePath] = await FileService.getFileByFilePath(data);

            if (!imgDownResult)
                this.false(imgDownCode, res);

            res.download(imgSavePath);

        } catch (err) {
            this.err(err, res);
        }

    }


    public movUpload = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, imgUploadSchema),
                DataValiator.checkString(['file', "fileDir", "fileType"])
            ) as imageInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [imgUploadResult, imgUploadCode, imgData] = await FileService.movUpload(res, data);

            if (imgUploadResult)
                this.true(imgUploadCode, res, imgData);
            else
                this.false(imgUploadCode, res);


        } catch (err) {
            this.err(err, res);
        }

    }

}

export default new FileController();
