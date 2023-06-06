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
const UserService_1 = __importDefault(require("../user/UserService"));
const ResultBox_1 = __importDefault(require("../../dto/ResultBox"));
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
function getMailTitle(authType) {
    let title;
    if (authType === 'FIND_PW')
        title = '고객님의 비밀번호 안내입니다.';
    else if (authType === 'FIND_ID')
        title = '고객님의 아이디 안내입니다.';
    return title;
}
class MailService extends ResultBox_1.default {
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
    static authEmail(authType, loginId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData;
                // 비밀번호 찾기는, 아이디를 기반으로 진행된다.
                if (authType === 'FIND_PW')
                    userData = yield UserService_1.default.getUserDataByLoginId(loginId);
                // 아이디 찾기는, 고객의 이메일을 기반으로 진행된다.
                else if (authType === 'FIND_ID')
                    userData = yield UserService_1.default.getUserDataByEmail(email);
                if (!userData)
                    return this.JustFalse('NU0');
                const userAuthData = yield UserService_1.default.getUserAuthData(userData.user_id, authType);
                let mailOptions = {
                    from: config_1.default.SMTP.user_email,
                    to: userData.email,
                    subject: getMailTitle(authType),
                    text: userAuthData.contents // 메일 내용
                };
                let sendEmailResult = yield transporter.sendMail(mailOptions);
                if (sendEmailResult.accepted.includes(userData.email))
                    return this.JustTrue('01');
                else
                    return this.JustFalse('01');
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.default = MailService;
//# sourceMappingURL=MailService.js.map