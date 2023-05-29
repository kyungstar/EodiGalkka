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
            let result = yield PayService_1.default.ready(data.userId, data.phone);
            if (result)
                return this.true(res, 'PRS0', { paySeq: result.insertId });
            else
                return this.false(res, 'PRF0');
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
            // sms 결제 준비
            let result = yield PayService_1.default.smsPay(res, data.ordNm, data.ordHpNo, data.mid, data.usrId, data.sid, data.goodsNm, data.goodsAmt);
            // result 결제 준비 처리 필요함
            if (result)
                return this.true(res, 'SC1');
            else
                return this.false(res, 'SF1');
        });
        // 문자 결제 내역 조회
        this.smsResult = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['mid', 'usrId', 'sid', 'reqId']));
            // sms 결제 내역 조회
            let result = yield PayService_1.default.smsPayResult(res, data.mid, data.usrId, data.sid, data.reqId);
            if (result)
                return this.true(res, 'S01', { result: result });
            else
                return this.false(res, 'S01');
        });
    }
}
exports.default = new PayController();
//# sourceMappingURL=PayController.js.map