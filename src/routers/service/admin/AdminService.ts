
import Config from "../../../../config"
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import MailService from "../mail/MailService";
import Logger from "../../../modules/Logger";
import {createToken, JwtModel} from "../../../middlewares/JwtAuth";
import ResultBox from "../../dto/ResultBox";
import DataChecker from "../../util/DataChecker";


const escape = require('mysql').escape;
const moment = require('moment');


const crypto = require("crypto");

export default class UserService extends ResultBox {


    public static async phoneCheck(phoneNumber: string) {

        try {

            let result = await DB.getOne(QM.Select("t_node_user", {}, {
                phone_number: phoneNumber
            }, ["*"]));

            if (result)
                return this.JustFalse('P01');
            else
                return this.JustTrue('P01');

        } catch (err) {
            Logger.debug(err + ' is Occured')
            return false;
        }
    }


    public static async emailCheck(email: string) {

        try {

            let result = await DB.getOne(QM.Select("t_node_user", {
                email: email
            }, {}, ["*"]))

            if (result)
                return this.JustFalse('E01');
            else
                return this.JustTrue('E01')

        } catch (err) {
            Logger.debug(err + ' is Occured')
            return false;
        }
    }


    public static async Join(loginId: string, pwd: string, email: string, name: string, nickName: string, phoneNumber: string, gender: string, address: string, addressDetail: string) {

        try {

            // 전화번호 중복 검증
            if (DataChecker.onlyResultInterpreter(await this.phoneCheck(phoneNumber), false))
                return this.JustErr('PA0');

            // 전화번호 중복 검증
            if (DataChecker.onlyResultInterpreter(await this.emailCheck(email), false))
                return this.JustErr('EA0');

            // 문자열을 바이트 배열로 변환
            const byteArr = Buffer.from(Config.DB.encrypt_key, 'utf-8');

            // 바이트 배열을 16진수 문자열로 변환
            const salt = byteArr.toString('hex');


            const iterations = 100000; // 반복 횟수
            const keyLength = 64; // 생성될 키의 길이
            const digest = 'sha512'; // 해시 알고리즘

            const derivedKey = crypto.pbkdf2Sync(pwd, salt, iterations, keyLength, digest);
            const encryptedPassword = derivedKey.toString('hex');


            let userId = Math.random().toString(36).substring(7, 25);

            const adminJoinResult = await DB.get([
                QM.Insert("t_node_user", {
                    user_id: userId,
                    login_id: loginId,
                    user_type: 'ADMIN',
                    email: email,
                    user_name: '\\(HEX(AES_ENCRYPT(' + escape(name) + ', ' + escape(Config.DB.encrypt_key) + ')))',
                    nickname: nickName,
                    phone_number: '\\(HEX(AES_ENCRYPT(' + escape(phoneNumber) + ', ' + escape(Config.DB.encrypt_key) + ')))',
                    gender: gender,
                    address: address,
                    address_detail: addressDetail,
                    status: 50
                }),
                QM.Insert("t_node_login", {
                    user_id: userId,
                    login_id: loginId,
                    pwd: encryptedPassword,
                    reg_date: '\\NOW()'
                })
            ])

            if (adminJoinResult)
                return this.JustTrue('01');
            else
                return this.JustFalse('01');

        } catch (err) {
            return this.JustErr(err);
        }
    }


    public static async Login(loginId: string, pwd: string) {

        try {

            const userInfoList = await DB.get([
                QM.Select("t_node_login",{
                    login_id: loginId
                },{},["*"]),
                QM.Select("t_node_user",{
                    login_id: loginId
                },{},["*"])
            ]);



            const userLoginData = userInfoList[0][0];
            const userInfoData = userInfoList[1][0];

            if(!userLoginData || !userInfoData)
                return this.JustFalse('NU0');

            // 회원정보가 승인되지 않음.
            if(userLoginData.status !== '100')
                return this.JustFalse('NAU');

            const byteArr = Buffer.from(Config.DB.encrypt_key, 'utf-8');

            // 바이트 배열을 16진수 문자열로 변환
            const salt = byteArr.toString('hex');

            const iterations = 100000; // 반복 횟수
            const keyLength = 64; // 생성될 키의 길이
            const digest = 'sha512'; // 해시 알고리즘

            const derivedKey = crypto.pbkdf2Sync(pwd, salt, iterations, keyLength, digest);
            const encryptedPassword = derivedKey.toString('hex');

            if(encryptedPassword !== userLoginData.pwd)
                return this.JustFalse('NP0');

            const token = createToken(new JwtModel(({u: userInfoData.user_id, t: userInfoData.user_type} as JwtModel)));

            return this.ObjTrue('LS0', [{token: token, user_info: userInfoData}]);

        } catch (err) {
            return this.JustErr(err);
        }
    }


}

