import {Request, Response} from "express";

const fs = require('fs');
const path = require('path');
const moment = require('moment')
const sharp = require('sharp')
import * as CryptoJS from 'crypto-js';

import Logger from "../../../modules/Logger";
import Config from "../../../../config";
import DataChecker from "../../util/DataChecker";
import {getConnection} from "typeorm";
import ResController from "../ResController";



// todo DFS

class FileController extends ResController {

    public imageUpload = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        try {

            let data = DataChecker.mergeObject(
                DataChecker.fileCheck(res, req.body, ['file'], true)
            ) as {
                file: string,
                targetType: string
            }

            const now = moment().format('YYYYMMDD')
            const dir = Config.DEFAULT_FILE_PATH + "/" + now;

            const randomString = Math.random().toString(36).substring(2, 12);

            const fileType = req.body.file.type.split('/')[1];
            const fileName = moment().format('YYYYMMDD_') + randomString + '.' + fileType;
            const fileThumbName = moment().format('YYYYMMDD_') + randomString + '_thumb.' + fileType;
            const fileSize = req.body.file.size;

            const uploadFilePath = "/" + now + "/" + fileName;
            const uploadThumbFilePath = "/" + now + "/" + fileThumbName;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            // 파일 업로드
            if (!fs.existsSync(Config.DEFAULT_FILE_PATH + "/" + now + "/" + req.body.file.originalFilename)) {
                fs.renameSync(req.body.file.path, Config.DEFAULT_FILE_PATH + "/" + now + "/" + fileName);
            }

            // 썸네일 업로드
            await sharp(dir + "/" + fileName).resize(200, 200).toFile(dir + "/" + fileThumbName);

            await this.resultInterpreter(req, res, fs);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public imageDown = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        try {

            let data = DataChecker.mergeObject(
                DataChecker.stringCheck(res, req.query, [], ["filePath"])
            ) as {
                filePath: string,
            }

            const downloadPath = Config.DEFAULT_FILE_PATH + "/" + data.filePath;

            res.download(downloadPath);

        } catch(err) {
            Logger.info(err + ' Caused On Error')
        }
    }


}


export default new FileController();