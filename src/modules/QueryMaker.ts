/**
 * Created By KYG On 2022-11-27
 */

import Logger from '../modules/Logger'
import ResController from "../routers/controller/ResController";
import Config from "../../config";

const escape = require('sqlstring').escape;

// todo 완전 개선 필요
class QueryMaker extends ResController {

    Insert = (tblName: string, insertObj: any) => {

        try {

            let query =
                " INSERT INTO " + tblName +
                " SET ";

            for (let k in insertObj) {
                try {
                    if (insertObj[k][0] === '\\')
                        query += k + " = " + insertObj[k].slice(1, insertObj[k].length) + ',';
                    else
                        query += k + " = " + escape(insertObj[k]) + ',';

                } catch (err) {
                    query += k + " = " + escape(insertObj[k]) + ',';

                }
            }

            query = query.slice(0, -1);

            return query;

        } catch (err) {
            Logger.debug('Query Insert Fail')
        }

    }

    decrpytSelect = (tblName: string, decryptSelectList: string[], selectList: string[], selectObj: any) => {


        try {
            let query =
                " SELECT ";

            for (let item of selectList) {
                query += item + ', '
            }

            if (decryptSelectList.length === 0)
                query = query.slice(0, -2);


            for (let k of decryptSelectList) {
                query += ` CONVERT(AES_DECRYPT(UNHEX(${escape(k)}),`.replace(/'/g, "") + escape(Config.DB.encrypt_key) + ") USING utf8) as " + escape(k) + ',';
            }


            query = query.slice(0, -1);


            query += " " +
                "   FROM " + tblName +
                "   WHERE 1 = 1 ";

            for (let k in selectObj) {

                if (selectObj[k][0] === '\\')
                    query += " AND " + k + selectObj[k].slice(1, selectObj[k].length);
                else
                    query += " AND " + k + " = " + escape(selectObj[k]);
            }


            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }

    Select = (tblName: string, selectObj: any, decryptSelectObj: any, selectList: string[]) => {

        try {

            let query =
                " SELECT ";

            for (let item of selectList) {
                query += item + ','
            }

            query = query.slice(0, -1);

            query += " " +
                "   FROM " + tblName +
                "   WHERE 1 = 1 ";

            for (let k in decryptSelectObj) {

                query += ` AND CONVERT(AES_DECRYPT(UNHEX(${escape(k)}),`.replace(/'/g, "") + escape(Config.DB.encrypt_key) + ") USING utf8) = " + escape(decryptSelectObj[k]);

            }

            for (let k in selectObj) {

                if (selectObj[k][0] === '\\')
                    query += " AND " + k + selectObj[k].slice(1, selectObj[k].length);
                else
                    query += " AND " + k + " = " + escape(selectObj[k]);
            }

            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }

    Delete = (tblName: string, targetObj: any) => {

        try {

            let query =
                "   DELETE" +
                "   FROM " + tblName +
                "   WHERE ";

            for (let k in targetObj) {
                try {
                    if (targetObj[k][0] === '\\')
                        query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + 'AND';
                    else
                        query += k + " = " + escape(targetObj[k]) + 'AND';

                } catch (err) {
                    query += k + " = " + escape(targetObj[k]) + 'AND';

                }
            }

            query = query.slice(0, -3);

            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }


    Update = (tblName: string, updateObj: any, targetObj: any) => {

        try {

            let query =
                "   UPDATE " + tblName +
                "   SET ";

            for (let k in updateObj) {
                try {
                    if (updateObj[k][0] === '\\')
                        query += k + " = " + updateObj[k].slice(1, updateObj[k].length) + ',';
                    else
                        query += k + " = " + escape(updateObj[k]) + ',';

                } catch (err) {
                    query += k + " = " + escape(updateObj[k]) + ',';

                }
            }

            query = query.slice(0, -1);

            query += "   WHERE ";

            for (let k in targetObj) {
                try {
                    if (targetObj[k][0] === '\\')
                        query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + ' AND ';
                    else
                        query += k + " = " + escape(targetObj[k]) + ' AND ';

                } catch (err) {
                    query += k + " = " + escape(targetObj[k]) + 'AND ';

                }
            }

            query = query.slice(0, -4);

            return query;

        } catch (err) {
            Logger.debug(err)
        }

    }


    joinTxt = (input: any, tblName: string, joinType: string, mappingTxt: string, selectList: string, decryptSelectList: string) => {

        try {

            let query = `SELECT ` + selectList;

            for (let k of decryptSelectList) {
                query += `, CONVERT(AES_DECRYPT(UNHEX(${escape(k)}),`.replace(/'/g, "") + escape(Config.DB.encrypt_key) + ") USING utf8) as " + escape(k) + '';
            }

            query += ` FROM (${input})  i `

            query += joinType + ' JOIN ' + tblName + ' j ON '  + mappingTxt;

            return query;

        } catch (err) {
            Logger.debug(err)
        }

    }

    getPage = (orderTargetList: any, targetPage: number) => {

        try {

            let footQuery = ` ORDER BY `

            for (const orderTargetData of orderTargetList) {
                footQuery += ` ${escape(orderTargetData)} DESC, `
            }


            footQuery = footQuery.slice(0, -2);

            if (orderTargetList.length !== 0)
                footQuery += ` LIMIT ${escape(30 * (targetPage - 1))}, ${escape(30 * (targetPage))}`;
            else
                footQuery = ` LIMIT ${escape(30 * (targetPage - 1))}, ${escape(30 * (targetPage))}`;


            return footQuery;

        } catch (err) {
            Logger.debug(err)
        }

    }


}

export default new QueryMaker();