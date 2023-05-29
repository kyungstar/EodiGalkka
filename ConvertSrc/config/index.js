"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEnum = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
process.env.ROOT_PATH = path_1.default.join(__dirname, "..");
let envFound = dotenv_1.default.config({ path: __dirname + "/.env." + process.argv[2].toLowerCase() });
if (envFound.error) {
    // 설정 로드 못함. 실행 실패
    throw new Error("Couldn't find .env file");
}
var ServerEnum;
(function (ServerEnum) {
    ServerEnum["WAS"] = "WAS";
})(ServerEnum = exports.ServerEnum || (exports.ServerEnum = {}));
class Config {
    constructor() {
        // Global
        this.PORT = parseInt(process.env.PORT, 10);
        this.SERVER_TYPE = process.env.SERVER_TYPE;
        this.DEFAULT_FILE_PATH = process.env.DEFAULT_FILE_PATH;
        this.FILE_SIZE = parseInt(process.env.FILE_SIZE);
        this.JWT = {
            SECRET: process.env.JWT_SECRET,
            EXPIRES_IN: process.env.JWT_EXPIRES_IN
        };
        this.SMTP = {
            user_email: process.env.USER_EMAIL,
            user_passwd: process.env.USER_PASSWD
        };
        this.DB = {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            connectionLimit: process.env.connectionLimit,
            encrypt_key: process.env.ENCRYPT_KEY,
            entity_path: process.env.ENTITY_PATH
        };
        this.SMS = {
            URL: process.env.URL,
            MERCHANT_KEY: process.env.MERCHANT_KEY
        };
        this.LOG = {
            LOG_PATH: process.env.LOG_PATH,
            LEVEL: process.env.LEVEL,
            FILE_SIZE: process.env.FILE_SIZE,
            FILE_CNT: process.env.FILE_CNT
        };
    }
}
exports.default = new Config();
//# sourceMappingURL=index.js.map