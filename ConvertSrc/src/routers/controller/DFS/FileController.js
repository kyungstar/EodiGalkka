"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sharp = require('sharp');
const Logger_1 = __importDefault(require("../../../modules/Logger"));
const config_1 = __importDefault(require("../../../../config"));
const DataChecker_1 = __importDefault(require("../../util/DataChecker"));
const ResController_1 = __importDefault(require("../ResController"));
class FileController extends ResController_1.default {
    constructor() {
        super(...arguments);
        this.imageUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, ['file'], true));
                const now = moment().format('YYYYMMDD');
                const dir = config_1.default.DEFAULT_FILE_PATH + "/" + now;
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
                if (!fs.existsSync(config_1.default.DEFAULT_FILE_PATH + "/" + now + "/" + req.body.file.originalFilename)) {
                    fs.renameSync(req.body.file.path, config_1.default.DEFAULT_FILE_PATH + "/" + now + "/" + fileName);
                }
                // 썸네일 업로드
                yield sharp(dir + "/" + fileName).resize(200, 200).toFile(dir + "/" + fileThumbName);
                yield this.resultInterpreter(req, res, fs);
            }
            catch (err) {
                yield this.errInterpreter(req, res, err);
            }
        });
        this.imageDown = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.query, ['filePath'], true));
                const downloadPath = config_1.default.DEFAULT_FILE_PATH + "/" + data.filePath;
                res.download(downloadPath);
            }
            catch (err) {
                Logger_1.default.info(err + ' Caused On Error');
            }
        });
    }
}
exports.default = new FileController();
//# sourceMappingURL=FileController.js.map