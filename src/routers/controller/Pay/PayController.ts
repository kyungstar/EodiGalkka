import {Request, Response} from "express";
import ResController from '../ResController';

import PayService from "../../service/pay/PayService"
import DataChecker from "../../../routers/util/DataChecker";

class PayController extends ResController {

    // 결제 데이터 저장
    public ready = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [], ['phone']),
            DataChecker.loadJWTValue(req.body),
        ) as {
            userId: string,
            phone: string
        };

        try {
            let payReadyResult = await PayService.ready(data.userId, data.phone);

            await this.resultInterpreter(req, res, payReadyResult);

        } catch (err) {

            await this.errInterpreter(req, res, err);

        }


    }


    // 결제 취소
    public cancel = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [],['paySeq'])
        ) as {
            paySeq: string
        };


    }


    // 문자 결제
    public sms = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [], ["goodsAmt", "ordNm"]),
            DataChecker.stringCheck(res, req.body, [], ["ordHpNo", "mid", "usrId", "sid", "goodsNm"])
        ) as {
            ordNm: string,
            ordHpNo: string,
            mid: string,
            usrId: string,
            sid: string,
            goodsNm: string,
            goodsAmt: number
        };

        try {

            // sms 문자 결제
            let smsPaySendResult = await PayService.smsPay(res, data.ordNm, data.ordHpNo, data.mid, data.usrId, data.sid, data.goodsNm, data.goodsAmt);

            await this.resultInterpreter(req, res, smsPaySendResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    // 문자 결제 내역 조회
    public smsResult = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [], ["mid", "usrId", "sid", "reqId"])
        ) as {
            reqId: string,
            mid: string,
            usrId: string,
            sid: string,
        };

        try {
            // sms 결제 내역 조회
            let smsPayResult = await PayService.smsPayResult(res, data.mid, data.usrId, data.sid, data.reqId);

            await this.resultInterpreter(req, res, smsPayResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }


    }


}

export default new PayController();