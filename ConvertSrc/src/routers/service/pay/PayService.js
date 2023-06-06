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
const config_1 = __importDefault(require("../../../../config"));
const Mysql_1 = __importDefault(require("../../../modules/Mysql"));
const QueryMaker_1 = __importDefault(require("../../../modules/QueryMaker"));
const ResultBox_1 = __importDefault(require("../../dto/ResultBox"));
const Axios = require('axios');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const smsDate = moment().format('YYYYMMDDHHMMss');
class PayService extends ResultBox_1.default {
    static ready(userId, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    user_id: userId,
                    phone: phone
                }, {}, ["*"]));
                if (!userData)
                    return null;
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Insert("t_node_pay", {
                    user_id: userData.user_id,
                    phone: userData.phone_number,
                    name: userData.name,
                    pay_status: 'READY',
                    order_status: 'READY'
                }));
                if (result) {
                    return this.ObjTrue('01', [{ poSeq: result.insertId }]);
                }
                else {
                    return this.JustFalse('01');
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    static smsPay(res, ordNm, ordHpNo, mid, usrId, sid, goodsNm, goodsAmt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var signData = getSignData(sid + usrId + smsDate + config_1.default.SMS.MERCHANT_KEY).toString();
                let result = yield Axios.post(config_1.default.SMS.URL, {
                    header: {
                        sid: sid,
                        trDtm: smsDate,
                        gubun: 'S' // 전문 구분 (요청 : 'S', 응답 : 'R')
                    },
                    body: {
                        usrId: usrId,
                        encKey: signData,
                        mid: mid,
                        goodsNm: goodsNm,
                        goodsAmt: goodsAmt,
                        moid: '1',
                        ordNm: ordNm,
                        ordHpNo: ordHpNo,
                        type: 0 // (0 : 기본, 1 : 추가)
                    }
                }, {
                    headers: {
                        'Content-type': 'application/json', 'charset': 'utf-8'
                    }
                });
                if (result) {
                    return this.ObjTrue('01', [{ result: result }]);
                }
                else {
                    return this.JustFalse('01');
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    static smsPayResult(res, mid, usrId, sid, reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var signData = getSignData(sid + usrId + smsDate + config_1.default.SMS.MERCHANT_KEY).toString();
                let result = yield Axios.post(config_1.default.SMS.URL, {
                    header: {
                        sid: sid,
                        trDtm: smsDate,
                        gubun: 'S',
                        resCode: "",
                        resMsg: ""
                    },
                    body: {
                        usrId: usrId,
                        encKey: signData,
                        mid: mid,
                        reqId: reqId,
                        type: 0 // (0 : 기본, 1 : 추가)
                    }
                }, {
                    headers: {
                        'Content-type': 'application/json', 'charset': 'utf-8'
                    }
                });
                if (result) {
                    return this.ObjTrue('01', [{ result: result }]);
                }
                else {
                    return this.JustFalse('01');
                }
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.default = PayService;
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}
//# sourceMappingURL=PayService.js.map