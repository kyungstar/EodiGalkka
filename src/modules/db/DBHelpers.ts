import mariadb from "mariadb";
import Config, {RUN_MODE} from "../../../config";
import Logger from "../middlewares/Logger";
import {decryptColumnList, encryptColumnList} from "../../../config/Security";

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
            Logger.error("executeQuery Err " + query + " : err");
            await conn.release();

        } finally {
            await conn.release();
        }
    }

    async findOne(tblName: string, whereObj: any, selectList: string[] = []) {

        let conn = await this.cluster.getConnection();

        const selectQuery: string = this.buildSelectColumns(tblName, selectList);

        const whereQuery: string = this.buildWhereClause(whereObj)

        const query: string = selectQuery + whereQuery;

        Logger.debug("findOne : " + query);

        try {

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

    async findAll(tblName: string, whereObj: any, selectList: string[], addQuery?: string) {

        let conn = await this.cluster.getConnection();

        const selectQuery: string = this.buildSelectColumns(tblName, selectList);

        const whereQuery: string = this.buildWhereClause(whereObj)

        const query: string = selectQuery + whereQuery;

        Logger.debug("findAll : " + query);

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



    private buildSelectColumns(tblName: string, selectList: string[]) {

        let query: string = `SELECT `;


        if (selectList.length === 0) {
            query += ' * ';
        } else {
            for (let selectData of selectList) {
                if (decryptColumnList.includes(selectData))
                    query += this.decrypt(selectData);
                else
                    query += selectData + ','
            }
        }

        query = query.slice(0, -1);

        query += `FROM ${tblName}`;

        return query
    }

    private buildWhereClause(whereObj: object[]) {

        let query = "WHERE 1 = 1 "

        for (let column in whereObj) {

            if (encryptColumnList.includes(column))
                query += ` AND ` + this.decrypt(column);
            else
                query += " AND " + column + " = " + escape(whereObj[column]);

        }

        return query;
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
            if(encryptColumnList.includes(k))
                query += k + this.encrypt(updateObj[k])
            else
                query += k + " = " + escape(updateObj[k]);
        }

        query += " " +
            "   WHERE 1 = 1 ";

        for (let k in whereObj) {
            if(decryptColumnList.includes(k))
                query += k + this.encrypt(whereObj[k])
            else
                query += k + " = " + escape(whereObj[k]);
        }

        Logger.info(`Update Query: ${query}`);

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


    private encrypt(targetObj: any) {

        const query = ` (HEX(AES_ENCRYPT(${escape(targetObj)}, ${escape(Config.DB[RUN_MODE].SECURITY.KEY)})))`;

        return query;

    }

    private decrypt(targetObj: any) {


        const query = ` CONVERT(AES_DECRYPT(UNHEX(${Object.keys(targetObj)}), ${escape(Config.DB[RUN_MODE].SECURITY.KEY)}) USING utf8) = ${escape(Object.values(targetObj))}`;

        return query;

    }




}

export default new MariaDB();
