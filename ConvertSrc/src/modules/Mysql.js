"use strict";
/**
 * Created by 유희찬 on 2020-07-16.
 */
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
const mariadb_1 = __importDefault(require("mariadb"));
const Logger_1 = __importDefault(require("../modules/Logger"));
class MariaDB {
    constructor() {
        this.cluster = mariadb_1.default.createPoolCluster({ removeNodeErrorCount: 5, restoreNodeTimeout: 5000 });
    }
    getCluster() {
        return this.cluster;
    }
    ;
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.cluster.getConnection();
                return connection;
            }
            catch (err) {
                Logger_1.default.debug(err + ' is Occured');
                throw err; // 오류를 다시 호출한 쪽으로 전달
            }
        });
    }
    getOne(statement) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield this.getConnection();
            try {
                let result = yield conn.query(statement.trim());
                Logger_1.default.debug("Query result - " + (!!result));
                Logger_1.default.debug(statement);
                yield conn.commit();
                yield conn.release();
                return result[0];
            }
            catch (err) {
                Logger_1.default.debug('Query Select Fail', err);
                yield conn.release();
                return null;
            }
        });
    }
    get(statement) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield this.getConnection();
            try {
                yield conn.beginTransaction();
                let query = statement.join(" ; ");
                let result = yield conn.query(query);
                if (result.length !== statement.length) {
                    throw new Error("Miss match query count! - Injection attack warning");
                }
                Logger_1.default.debug("Query result - " + (!!result));
                Logger_1.default.debug(query);
                yield conn.commit();
                yield conn.release();
                return result;
            }
            catch (err) {
                yield conn.rollback();
                yield conn.release();
                Logger_1.default.debug('Query Execute Fail', err);
            }
        });
    }
    Executer(statement) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield this.getConnection();
            try {
                let result = yield conn.query(statement.trim());
                yield conn.commit();
                yield conn.release();
                Logger_1.default.debug("Query result - " + (!!result));
                Logger_1.default.debug(statement);
                return result.affectedRows;
            }
            catch (err) {
                yield conn.rollback();
                yield conn.release();
                return null;
            }
        });
    }
    getInsertId(statement) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield this.getConnection();
            try {
                let result = yield conn.query(statement.trim());
                yield conn.commit();
                yield conn.release();
                Logger_1.default.debug("Query result - " + (!!result));
                Logger_1.default.debug(statement);
                return result.insertId;
            }
            catch (err) {
                yield conn.rollback();
                yield conn.release();
                return null;
            }
        });
    }
}
exports.default = new MariaDB();
//# sourceMappingURL=Mysql.js.map