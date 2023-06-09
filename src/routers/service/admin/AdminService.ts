const escape = require('mysql').escape;
const moment = require('moment');
const crypto = require("crypto");


import Config from "../../../../config"
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import Logger from "../../../modules/Logger";

import {createToken, JwtModel} from "../../../middlewares/JwtAuth";
import ResultBox from "../../dto/ResultBox";
import DataChecker from "../../util/DataChecker";
import SecurityAuth from "../../../middlewares/SecurityAuth";


export default class AdminService extends ResultBox {


    public static async phoneCheck(phoneNumber: string, userType: string) {

        try {

            let result = await DB.getOne(QM.Select("t_node_user", {}, {
                phone_number: phoneNumber,
                user_type: userType
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


    public static async emailCheck(email: string, userType: string) {

        try {

            let result = await DB.getOne(QM.Select("t_node_user", {
                email: email,
                user_type: userType
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


    public static async Join(loginId: string, pwd: string, email: string, name: string
        , nickName: string, phoneNumber: string, gender: string, address: string, addressDetail: string
        , userType: string) {

        try {

            // 전화번호 중복 검증
            if (DataChecker.onlyResultInterpreter(await this.phoneCheck(phoneNumber, userType), false))
                return this.JustErr('PA0');

            // 전화번호 중복 검증
            if (DataChecker.onlyResultInterpreter(await this.emailCheck(email, userType), false))
                return this.JustErr('EA0');


            let userId = Math.random().toString(36).substring(7, 25);

            // getEncryptPwd
            const encryptedPassword = await SecurityAuth.getEncryptPwd(userId, pwd);

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
                QM.Select("t_node_login", {
                    login_id: loginId
                }, {}, ["*"]),
                QM.Select("t_node_user", {
                    login_id: loginId
                }, {}, ["*"])
            ]);

            const userLoginData = userInfoList[0][0];
            const userInfoData = userInfoList[1][0];

            if (!userLoginData || !userInfoData)
                return this.JustFalse('NU0');

            // 회원정보가 승인되지 않음.
            if (userInfoData.status !== 70)
                return this.JustFalse('NAU');

            // getEncryptPwd
            const encryptedPassword = await SecurityAuth.getEncryptPwd(userInfoData.user_id, pwd);

            if (encryptedPassword !== userLoginData.pwd)
                return this.JustFalse('NP0');

            const token = createToken(new JwtModel(({u: userInfoData.user_id, t: userInfoData.user_type} as JwtModel)));

            return this.ObjTrue('LS0', [{token: token, user_info: userInfoData}]);

        } catch (err) {
            return this.JustErr(err);
        }
    }

    public static async agencyJoinList(userType: string) {

        try {


            const userInfoList = await DB.getList(QM.decrpytSelect("t_node_user", ["phone_number", "user_name"]
                , ["user_id", "email", "nickname", "gender", "address"
                    , "address_detail", "join_reason", "agency_name", "login_id"]
                , {
                    user_type: userType,
                    status: 50
                }
            ));

            if (userInfoList)
                return this.ObjTrue('LS0', [{userInfoList: userInfoList}]);
            else
                return this.JustFalse('NU1')


        } catch (err) {
            return this.JustErr(err);
        }
    }


    public static async joinAccept(status: string, userId: string) {

        try {

            const joinAccept = DB.Executer(QM.Update("t_node_user",{status: status}, {user_id: userId}));

            if(joinAccept)
                return this.JustTrue('US1')
            else
                return this.JustFalse('UF1')


        } catch (err) {
            return this.JustErr(err);
        }
    }


}

