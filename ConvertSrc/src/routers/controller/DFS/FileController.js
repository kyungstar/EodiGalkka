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
const BaseController_1 = __importDefault(require("../Base/BaseController"));
const Logger_1 = __importDefault(require("../../../Module/Logger"));
const Config_1 = __importDefault(require("../../../../Config"));
const DataChecker_1 = __importDefault(require("../../Util/DataChecker"));
const typeorm_1 = require("typeorm");
const File_1 = require("../../Data/entities/File");
class FileController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.imageUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, ['file'], true));
                const now = moment().format('YYYYMMDD');
                const dir = Config_1.default.DEFAULT_FILE_PATH + "/" + now;
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
                if (!fs.existsSync(Config_1.default.DEFAULT_FILE_PATH + "/" + now + "/" + req.body.file.originalFilename)) {
                    fs.renameSync(req.body.file.path, Config_1.default.DEFAULT_FILE_PATH + "/" + now + "/" + fileName);
                }
                // 썸네일 업로드
                yield sharp(dir + "/" + fileName).resize(200, 200).toFile(dir + "/" + fileThumbName);
                const fileRepository = (0, typeorm_1.getConnection)().getRepository(File_1.ygFile);
                const fileData = new File_1.ygFile();
                fileData.target_type = data.targetType;
                fileData.target_key = 1;
                fileData.file_path = uploadFilePath;
                fileData.thumb_file_path = uploadThumbFilePath;
                fileData.file_size = fileSize;
                yield fileRepository.save(fileData);
                return this.true(res, 'SU1');
            }
            catch (err) {
                return this.err(res, 'UF2', err);
            }
        });
        this.imageDown = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.query, ['filePath'], true));
                const downloadPath = Config_1.default.DEFAULT_FILE_PATH + "/" + data.filePath;
                res.download(downloadPath);
            }
            catch (err) {
                Logger_1.default.info(err + ' Caused On Error');
            }
        });
        this.imageDownBySeq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.query, ['fileSeq', 'fileType'], true));
                console.log(data.fileSeq);
                //const downloadPath = Config.DEFAULT_FILE_PATH + "/" + data.filePath;
                const fileRepository = (0, typeorm_1.getConnection)().getRepository(File_1.ygFile);
                const fileData = yield fileRepository.findOne({ where: { file_seq: data.fileSeq } });
                if (!fileData)
                    return this.false(res, 'NF0');
                const dir = Config_1.default.DEFAULT_FILE_PATH;
                const downloadPath = dir + fileData.file_path;
                res.download(downloadPath);
            }
            catch (err) {
                Logger_1.default.info(err + ' Caused On Error');
                this.err(res, 'D01', err);
            }
        });
    }
}
exports.default = new FileController();
//# sourceMappingURL=FileController.js.map