import ResController from "../../controller/ResController";
import Config from "../../../../config"
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import {createToken, JwtModel} from "../../../middlewares/JwtAuth";
import ResultBox from "../../dto/ResultBox";

const Axios = require('axios');
const moment = require('moment');
const CryptoJS = require('crypto-js');

const smsDate = moment().format('YYYYMMDDHHMMss');


export default class PayService extends ResultBox {

    public static async ready(userId: string, phone: string) {

        try {


            let userData = await DB.getOne(QM.Select("t_node_user",{
                user_id: userId,
                phone: phone
            }, {},["*"]));


            if(!userData)
                return null;

            let result = await DB.Executer(QM.Insert("t_node_pay",{
                user_id: userData.user_id,
                phone: userData.phone_number,
                name: userData.name,
                pay_status: 'READY',
                order_status: 'READY'
            }))

            if (result) {
                return this.ObjTrue('01', [{poSeq: result.insertId}]);
            } else {
                return this.JustFalse('01');
            }


        } catch (err) {
            return err;
        }
    }


    public static async smsPay(res: any, ordNm: string, ordHpNo: string, mid: string,
        usrId: string, sid: string, goodsNm: string, goodsAmt: number) {

        try {

            var signData = getSignData(sid + usrId + smsDate + Config.SMS.MERCHANT_KEY).toString()

            let result = await Axios.post(Config.SMS.URL, {
                header: {
                    sid: sid, // 전문 ID, 업무별 정의된 ID 입력
                    trDtm: smsDate, // API 전송 일시 (YYYYmmddHHMMSS)
                    gubun: 'S' // 전문 구분 (요청 : 'S', 응답 : 'R')
                },
                body: {
                    usrId: usrId, // 상점 로그인 ID
                    encKey: signData, // 암호화 Key
                    mid: mid, // 가맹점 ID
                    goodsNm: goodsNm, // 상품명
                    goodsAmt: goodsAmt, // 상품 가격
                    moid: '1', // 상품 주문번호
                    ordNm: ordNm, // 구매자명
                    ordHpNo: ordHpNo, // 구매자 휴대폰 번호, "-" 기호 없이 입력
                    type: 0  // (0 : 기본, 1 : 추가)
                }
            }, {
                headers: {
                    'Content-type': 'application/json', 'charset': 'utf-8'
                }
            });

            if (result) {
                return this.ObjTrue('01', [{result: result}]);
            } else {
                return this.JustFalse('01');
            }

        } catch (err) {
            return err;
        }
    }

    public static async smsPayResult(res: any, mid: string, usrId: string, sid: string, reqId: string) {

        try {

            var signData = getSignData(sid + usrId + smsDate + Config.SMS.MERCHANT_KEY).toString()

            let result = await Axios.post(Config.SMS.URL, {
                header: {
                    sid: sid, // 전문 ID, 업무별 정의된 ID 입력
                    trDtm: smsDate, // API 전송 일시 (YYYYmmddHHMMSS)
                    gubun: 'S', // 전문 구분 (요청 : 'S', 응답 : 'R')
                    resCode: "",
                    resMsg: ""
                },
                body: {
                    usrId: usrId, // 상점 로그인 ID
                    encKey: signData, // 암호화 Key
                    mid: mid, // 가맹점 ID
                    reqId: reqId,
                    type: 0  // (0 : 기본, 1 : 추가)
                }
            }, {
                headers: {
                    'Content-type': 'application/json', 'charset': 'utf-8'
                }
            });


            if (result) {
                return this.ObjTrue('01', [{result: result}]);
            } else {
                return this.JustFalse('01');
            }

        } catch (err) {
            return err;
        }
    }


}


function getSignData(str: string) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

