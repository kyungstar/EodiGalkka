import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import Config from "../../config";

// TODO 완전 개선이 필요하다.
export class JwtModel {

    u: string;
    t: string;

    constructor(obj: JwtModel){
        this.u = obj.u;
        this.t = obj.t;
    }

    public getAll() {
        return {u: this.u, t: this.t};
    }

    public deliverReqData(req: Request) {
        req.body.userId = this.u;
        req.body.userType = this.t;
        return;
    }

}

export function createToken(input: JwtModel) {
    return jwt.sign(input.getAll(), Config.JWT.SECRET, {
        expiresIn: Config.JWT.EXPIRES_IN
    });

}

export function jwtAuthCheck(req: Request, res: Response, next: NextFunction) {

    let token = req.headers.authorization

    if (!token || token.indexOf("Bearer ", 0) < 0)
        return res.status(401).send({result: false, code: "401"});

    token = token.slice(7, token.length);

    let tokenData;

    try {
        tokenData = new JwtModel(<JwtModel>jwt.verify(token, Config.JWT.SECRET));
        res.locals.jwtPayload = tokenData;

    } catch (err) {
        return res.status(401).send({result: false, code: "401", err: 'JWT Auth Error'});

    }

    tokenData.deliverReqData(req);

    res.setHeader("token", token);

    next();
}




