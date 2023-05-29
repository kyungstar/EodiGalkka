"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PayController_1 = __importDefault(require("./PayController"));
const router = (0, express_1.Router)();
// 결제전 서버저장
router.post("/pay/ready", PayController_1.default.ready);
// 결제전 문자 결제 요청하기
router.post("/pay/sms", PayController_1.default.sms);
// 결제정보 저장하기
router.post("/pay/sms/result", PayController_1.default.smsResult);
exports.default = router;
//# sourceMappingURL=index.js.map