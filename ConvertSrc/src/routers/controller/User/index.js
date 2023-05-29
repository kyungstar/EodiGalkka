"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("./UserController"));
const router = (0, express_1.Router)();
// 이메일 중복검사 🆗
router.post("/user/email/check", UserController_1.default.userEmail);
// 전화번호 중복검사 🆗
router.post("/user/phone/check", UserController_1.default.userPhone);
// 회원가입 🆗
router.post("/user/join", UserController_1.default.userJoin);
// 고객 로그인
router.post("/user/login", UserController_1.default.userLogin);
// 인증발송 API 🆗
router.post("/send/auth", UserController_1.default.sendAuth);
// 인증하기 🆗
router.post("/user/auth", UserController_1.default.userAuth);
// 비밀번호 변경하기
router.post("/user/password", UserController_1.default.resetPw);
// 고객정보 변경하기
router.post("/user/update", UserController_1.default.updateUser);
exports.default = router;
//# sourceMappingURL=index.js.map