"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthCheck = exports.createToken = exports.JwtModel = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
class JwtModel {
    constructor(obj) {
        this.u = obj.u;
        this.t = obj.t;
    }
    getAll() {
        return { u: this.u, t: this.t };
    }
    deliverReqData(req) {
        req.body.userId = this.u;
        req.body.userType = this.t;
        return;
    }
}
exports.JwtModel = JwtModel;
function createToken(input) {
    return jsonwebtoken_1.default.sign(input.getAll(), config_1.default.JWT.SECRET, {
        expiresIn: config_1.default.JWT.EXPIRES_IN
    });
}
exports.createToken = createToken;
function jwtAuthCheck(req, res, next) {
    let token = req.headers["authorization"];
    if (!token)
        return res.status(401).send({ result: false, code: "401" });
    if (token.indexOf("Bearer ", 0) < 0)
        return res.status(401).send({ result: false, code: "401 Bearer" });
    token = token.slice(7, token.length);
    let jwtPayload;
    try {
        jwtPayload = new JwtModel(jsonwebtoken_1.default.verify(token, config_1.default.JWT.SECRET));
        res.locals.jwtPayload = jwtPayload;
    }
    catch (err) {
        return res.status(401).send({ result: false, code: "401", err: 'JWT Auth Error' });
    }
    jwtPayload.deliverReqData(req);
    let newToken = createToken(jwtPayload);
    res.setHeader("token", newToken);
    next();
}
exports.jwtAuthCheck = jwtAuthCheck;
//# sourceMappingURL=JwtAuth.js.map