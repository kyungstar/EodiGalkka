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
const ResController_1 = __importDefault(require("../../controller/ResController"));
const config_1 = __importDefault(require("../../../../config"));
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    service: 'Naver',
    port: 587,
    host: 'smtp.naver.com',
    secure: false,
    requireTLS: true,
    auth: {
        user: config_1.default.SMTP.user_email,
        pass: config_1.default.SMTP.user_passwd // 보내는 메일의 비밀번호
    }
});
class MailService extends ResController_1.default {
    static send(targetMail, title, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 메일 옵션
                let mailOptions = {
                    from: config_1.default.SMTP.user_email,
                    to: targetMail,
                    subject: title,
                    text: contents // 메일 내용
                };
                // 메일 발송
                let result = yield transporter.sendMail(mailOptions);
                if (!result)
                    return null;
                let resultObj = {
                    accepted: result.accepted,
                    rejected: result.rejected
                };
                return resultObj;
            }
            catch (err) {
                return null;
            }
        });
    }
    static authEmail(targetMail, title, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 메일 옵션
                let mailOptions = {
                    from: config_1.default.SMTP.user_email,
                    to: targetMail,
                    subject: title,
                    text: contents // 메일 내용
                };
                // 메일 발송
                let result = yield transporter.sendMail(mailOptions);
                if (!result)
                    return null;
                let resultObj = {
                    accepted: result.accepted,
                    rejected: result.rejected
                };
                return resultObj;
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.default = MailService;
//# sourceMappingURL=MailService.js.map