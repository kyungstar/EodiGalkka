import mariadb from "mariadb";
import Config, {RUN_MODE} from "../../../config";
import Logger from "../middlewares/Logger";
import {query} from "express";

const escape = require('sqlstring').escape;

class MariaDB<T> {
    private cluster: any;


    constructor() {
        this.cluster = mariadb.createPoolCluster({
            removeNodeErrorCount: 5,
            restoreNodeTimeout: 5000,
        });
        this.initializeCluster();
    }


    private initializeCluster() {
        this.cluster.add("master", {
            host: Config.DB[RUN_MODE].MYSQL.HOST,
            port: Config.DB[RUN_MODE].MYSQL.PORT,
            user: Config.DB[RUN_MODE].MYSQL.USER,
            password: Config.DB[RUN_MODE].MYSQL.PASSWORD,
            database: Config.DB[RUN_MODE].MYSQL.DATABASE,
            multiplequerys: true,
            connectionLimit: Config.DB[RUN_MODE].MYSQL.CONNECTION_LIMIT,
            collation: "utf8mb4_general_ci",
            acquireTimeout: 10000,
            dateStrings: true,
            timezone: "Asia/Seoul",
        });
    }


    private async executeQuery(query: string): Promise<string | null> {
        const conn = await this.cluster.getConnection();

        try {
            const result = await conn.query(query);
            await conn.release();

            return result?.affectedRows;
        } catch (err) {
            Logger.error(err);
            await conn.release();

        } finally {
            await conn.release();
        }
    }

    async findOne(tblName: string, whereObj: any, decryptSelectObj: any = {}, selectList: string[] = []) {

        let conn = await this.cluster.getConnection();

        let query =
            " SELECT ";

        if (selectList.length === 0) {
            query += " * "
        } else {
            for (let item of selectList) {
                if (item === '\\')
                    query += ` AND CONVERT(AES_DECRYPT(UNHEX(${escape(item)}),`.replace(/'/g, "") + escape(Config.DB[RUN_MODE].SECURITY.KEY) + ") USING utf8) as " + item;
                else
                    query += item + ','
            }
        }


        query = query.slice(0, -1);

        query += " " +
            "   FROM " + tblName +
            "   WHERE 1 = 1 ";

        for (let k in decryptSelectObj) {
            query += ` AND CONVERT(AES_DECRYPT(UNHEX(${escape(k)}),`.replace(/'/g, "") + escape(Config.DB[RUN_MODE].SECURITY.KEY) + ") USING utf8) = " + escape(decryptSelectObj[k]);

        }

        for (let k in whereObj) {

            // Decrypt 쿼리 Function을 사용할 때
            if (whereObj[k][0] === '\\')
                query += " AND  " + whereObj[k].slice(1, whereObj[k].length);
            else
                query += " AND " + k + " = " + escape(whereObj[k]);
        }

        try {

            Logger.info("SELECT Query : " + query);

            const result = await conn.query(query);
            await conn.release();


            return result ? result[0] : null;

        } catch (err) {
            Logger.error(err);
            await conn.release();
            return null;
        } finally {
            await conn.release();
        }


    }

    async findAll(tblName: string, selectObj: Record<string, T>, selectList: string[], addQuery?: string) {

        let conn = await this.cluster.getConnection();

        let query =
            " SELECT ";

        if (selectList.length === 0) {
            query += " * "
        } else {
            for (let item of selectList) {
                query += item + ','
            }
        }


        query = query.slice(0, -1);

        query += " " +
            "   FROM " + tblName +
            "   WHERE 1 = 1 ";


        for (let k in selectObj) {
            query += " AND " + k + " = " + escape(selectObj[k]);
        }

        if (addQuery)
            query += " " + addQuery;

        Logger.debug(`findAll Query: ${query}`);

        try {
            const result = await conn.query(query);
            await conn.release();

            return result ? result : null;

        } catch (err) {
            Logger.error(err);
            await conn.release();
            return null;
        } finally {
            await conn.release();
        }

    }


    async update(tblName: string, updateObj: Record<string, T>, whereObj: Record<string, T>, transaction: boolean = false) {

        const query = this.updateQuery(tblName, updateObj, whereObj);

        if (transaction) {
            return query;
        }

        const result = await this.executeQuery(query);

        return result ? result : null;

    }


    deleteQuery(tblName: string, whereObj: any): string {
        let query = `DELETE FROM ${tblName}`;

        query += ` WHERE 1 = 1`;

        for (const key in whereObj) {
            query += ` AND ${key} = ${escape(whereObj[key])}`;
        }

        Logger.debug(`Delete Query: ${query}`);

        return query;
    }


    async insert(tblName: string, insertObj: any, option: string = "", transaction: boolean = false): Promise<string | null> {

        const query = this.insertQuery(tblName, insertObj, option);

        if (transaction) {
            return query;
        }

        const result = await this.executeQuery(query);

        return result ? result : null;


    }

    insertQuery(tblName: string, insertObj: any, option: string = ""): string {

        let query =
            ` ${option === "REPLACE" ? option : `INSERT ${option}`}  INTO ${tblName} SET `;


        for (let k in insertObj) {
            if (insertObj[k][0] === '\\') {
                query += k + " = " + insertObj[k].slice(1, insertObj[k].length) + ",";
            } else
                query += k + " = " + escape(insertObj[k]) + ",";

        }

        query = query.slice(0, -1);

        Logger.info("Insert Query : " + query);

        return query;
    }


    updateQuery(tblName: string, updateObj: any, whereObj: any): string {

        let query =
            " UPDATE " + tblName + " SET ";

        for (let k in updateObj) {
            query += k + " = " + escape(updateObj[k]);
        }

        query += " " +
            "   WHERE 1 = 1 ";

        for (let k in whereObj) {
            query += " AND " + k + " = " + escape(whereObj[k]);
        }

        Logger.debug(`Update Query: ${query}`);

        return query;
    }


    async delete(tblName: string, whereObj: any, transaction: boolean = false): Promise<string | null> {

        const query = this.deleteQuery(tblName, whereObj);

        if (transaction) {
            return query;
        }

        const result = await this.executeQuery(query);

        return result;
    }


    async transaction(statement: string[]): Promise<boolean> {

        let conn = await this.cluster.getConnection();

        try {
            await conn.beginTransaction();

            for (const targetQuery of statement) {
                let result = await conn.query(targetQuery);
                Logger.info("Query result - " + (!!result));

                if (!result) {
                    throw new Error("Query execution failed: " + targetQuery);
                }
            }

            await conn.commit();
            await conn.release();

            return true;

        } catch (err) {

            await conn.rollback();
            await conn.release();
            Logger.info('Query Execute Fail : ', err);
            return null;

        } finally {
            await conn.release();
        }

    }


    encrypt<T>(targetObj: T) {

        const query = `\\(HEX(AES_ENCRYPT(${escape(targetObj)}, ${escape(Config.DB[RUN_MODE].SECURITY.KEY)})))`;

        return query;

    }

    decrypt(targetObj: any) {


        const query = `\\CONVERT(AES_DECRYPT(UNHEX(${Object.keys(targetObj)}), ${escape(Config.DB[RUN_MODE].SECURITY.KEY)}) USING utf8) = ${escape(Object.values(targetObj))}`;

        const targetKey = Object.keys(targetObj);

        return {query};

    }


}

export default new MariaDB();
