"use strict";
/**
 * Make By KYG On 2023-04-16
 * LOG LEVEL
 error: 0 , warn: 1 , info: 2 , http: 3 , verbose: 4 , debug: 5 , silly: 6
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = __importDefault(require("../../config"));
class Logger {
    constructor() {
        const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level} : ${info.message}`));
        this.option = {
            format,
            level: config_1.default.LOG.LEVEL,
            transports: [
                new winston_daily_rotate_file_1.default({
                    level: config_1.default.LOG.LEVEL,
                    datePattern: 'YYYYMMDD',
                    dirname: config_1.default.LOG.LOG_PATH,
                    filename: config_1.default.SERVER_TYPE + "_%DATE%.log",
                    maxSize: config_1.default.LOG.FILE_SIZE,
                    maxFiles: config_1.default.LOG.FILE_CNT,
                }),
                new winston_1.default.transports.Console({
                    handleExceptions: true,
                })
            ]
        };
        this.LogLoader = winston_1.default.createLogger(this.option);
    }
}
const logger = new Logger();
exports.default = logger.LogLoader;
//# sourceMappingURL=Logger.js.map