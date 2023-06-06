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
const ResController_1 = __importDefault(require("../ResController"));
const PayService_1 = __importDefault(require("../../service/pay/PayService"));
const DataChecker_1 = __importDefault(require("../../../routers/util/DataChecker"));
class PayController extends ResController_1.default {
    constructor() {
        super(...arguments);
        // 결제 데이터 저장
        this.ready = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['phone']));
            try {
                let payReadyResult = yield PayService_1.default.ready(data.userId, data.phone);
                yield this.resultInterpreter(req, res, payReadyResult);
            }
            catch (err) {
                yield this.errInterpreter(req, res, err);
            }
        });
        // 결제 취소
        this.cancel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['paySeq']));
        });
        // 문자 결제
        this.sms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, [
                'ordNm', 'ordHpNo', 'goodsNm', 'goodsAmt', 'mid', 'usrId', 'sid'
            ]));
            try {
                // sms 문자 결제
                let smsPaySendResult = yield PayService_1.default.smsPay(res, data.ordNm, data.ordHpNo, data.mid, data.usrId, data.sid, data.goodsNm, data.goodsAmt);
                yield this.resultInterpreter(req, res, smsPaySendResult);
            }
            catch (err) {
                yield this.errInterpreter(req, res, err);
            }
        });
        // 문자 결제 내역 조회
        this.smsResult = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['mid', 'usrId', 'sid', 'reqId']));
            try {
                // sms 결제 내역 조회
                let smsPayResult = yield PayService_1.default.smsPayResult(res, data.mid, data.usrId, data.sid, data.reqId);
                yield this.resultInterpreter(req, res, smsPayResult);
            }
            catch (err) {
                yield this.errInterpreter(req, res, err);
            }
        });
    }
}
exports.default = new PayController();
//# sourceMappingURL=PayController.js.map