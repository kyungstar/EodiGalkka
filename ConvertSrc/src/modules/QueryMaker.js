"use strict";
/**
 * Created By KYG On 2022-11-27
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../modules/Logger"));
const ResController_1 = __importDefault(require("../routers/controller/ResController"));
const escape = require('sqlstring').escape;
class QueryMaker extends ResController_1.default {
    constructor() {
        super(...arguments);
        this.Insert = (tblName, insertObj) => {
            try {
                let query = " INSERT INTO " + tblName +
                    " SET ";
                for (let k in insertObj) {
                    try {
                        if (insertObj[k][0] === '\\')
                            query += k + " = " + insertObj[k].slice(1, insertObj[k].length) + ',';
                        else
                            query += k + " = " + escape(insertObj[k]) + ',';
                    }
                    catch (err) {
                        query += k + " = " + escape(insertObj[k]) + ',';
                    }
                }
                query = query.slice(0, -1);
                return query;
            }
            catch (err) {
                Logger_1.default.debug('Query Insert Fail');
            }
        };
        // todo 수정해야함
        this.Select = (tblName, selectObj, selectList) => {
            try {
                let query = " SELECT ";
                for (let item of selectList) {
                    query += item + ',';
                }
                query = query.slice(0, -1);
                query += " " +
                    "   FROM " + tblName +
                    "   WHERE 1 = 1 ";
                for (let k in selectObj) {
                    if (selectObj[k][0] === '\\')
                        query += " AND " + k + selectObj[k].slice(1, selectObj[k].length);
                    else
                        query += " AND " + k + " = " + escape(selectObj[k]);
                }
                return query;
            }
            catch (err) {
                Logger_1.default.debug('Query Select Fail');
            }
        };
        this.Delete = (tblName, targetObj) => {
            try {
                let query = "   DELETE" +
                    "   FROM " + tblName;
                query += " " +
                    "   WHERE ";
                for (let k in targetObj) {
                    try {
                        if (targetObj[k][0] === '\\')
                            query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + 'AND';
                        else
                            query += k + " = " + escape(targetObj[k]) + 'AND';
                    }
                    catch (err) {
                        query += k + " = " + escape(targetObj[k]) + 'AND';
                    }
                }
                query = query.slice(0, -3);
                return query;
            }
            catch (err) {
                Logger_1.default.debug('Query Select Fail');
            }
        };
        this.Update = (tblName, updateObj, targetObj) => {
            try {
                let query = "   UPDATE " + tblName +
                    "   SET ";
                for (let k in updateObj) {
                    try {
                        if (updateObj[k][0] === '\\')
                            query += k + " = " + updateObj[k].slice(1, updateObj[k].length) + ',';
                        else
                            query += k + " = " + escape(updateObj[k]) + ',';
                    }
                    catch (err) {
                        query += k + " = " + escape(updateObj[k]) + ',';
                    }
                }
                query = query.slice(0, -1);
                query += "   WHERE ";
                for (let k in targetObj) {
                    try {
                        if (targetObj[k][0] === '\\')
                            query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + 'AND';
                        else
                            query += k + " = " + escape(targetObj[k]) + 'AND';
                    }
                    catch (err) {
                        query += k + " = " + escape(targetObj[k]) + 'AND';
                    }
                }
                query = query.slice(0, -3);
                return query;
            }
            catch (err) {
                Logger_1.default.debug('Query Select Fail');
            }
        };
    }
}
exports.default = new QueryMaker();
//# sourceMappingURL=QueryMaker.js.map