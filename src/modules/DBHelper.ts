import mariadb, {PoolCluster, PoolConnection} from "mariadb";
import Logger from '../modules/Logger';
import Config, {RUN_MODE} from "../../config";
import {escape} from "sqlstring";
import JSON from "json-bigint";
import {EncryptColumns} from "../../config/Security"

interface DBConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    multipleStatements: boolean;
}


interface InsertObject {
    [key: string]: string | number | boolean; // Adjust the types based on your requirements
}

interface TargetObject {
    [key: string]: string | number | boolean; // Adjust the types based on your requirements
}


class DBHelper {
    private cluster: PoolCluster;

    constructor(Config: DBConfig) {
        this.cluster = mariadb.createPoolCluster({
            removeNodeErrorCount: 5,
            restoreNodeTimeout: 5000
        });

        this.cluster.add('master', Config);

    }

    public getCluster(): PoolCluster {
        return this.cluster;
    }

    public async getConnection(retry = 3): Promise<PoolConnection> {
        try {
            const connection = this.getCluster();

            return connection.getConnection();
        } catch (err) {
            Logger.debug(`${err} occurred`);
            if (retry > 0) {
                // Retry with a delay
                await this.delay(1000); // 1-second delay
                return this.getConnection(retry - 1);
            } else {
                return null;
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    public async executeQuery(statement: string): Promise<PoolConnection> {
        let conn = await this.getConnection();

        try {
            let result = await conn.query(statement.trim());

            await conn.commit();
            await conn.release();

            return result;

        } catch (err) {
            Logger.debug('Query Select Fail', err);
            await conn.release();
            return null;
        }
    }

    async tranQuery(statement: (string | object)[]) {

        let conn: mariadb.PoolConnection = await this.getConnection();

        try {

            await conn.beginTransaction();

            let query: string = statement.join(";");

            let result = await conn.query(query);

            const totalAffectedRows = result.reduce((sum: number, current: any) => sum + current.affectedRows, 0);

            if(statement.length !== totalAffectedRows) {
                throw new Error("Not Match AffectRows")
            }


            await conn.commit();
            await conn.release();

            return result;

        } catch (err) {
            await conn.rollback();
            await conn.release();
            Logger.debug('tranQuery Fail', err);
        }
    }




    findOne = async (tblName: string, whereObj?: any, selectList?: string[]): Promise<object> => {
        try {

            let selectQuery: string = `SELECT `;

            if(selectList)
                selectQuery += this.getSelectTargetQuery(selectList);
            else
                selectQuery += ` * `

            selectQuery += ` FROM ${tblName}`;

            let whereQuery: string = ``;

            if (whereObj)
                whereQuery = this.getWhereQuery(whereObj);

            const targetQuery = selectQuery + whereQuery;

            Logger.debug('findOne Query is : ' + targetQuery);

            const resultSet: any = await this.executeQuery(targetQuery);

            if (!resultSet)
                return null;

            Logger.debug('findOne Query Result : ' + JSON.stringify(resultSet));

            return resultSet[0];

        } catch (err) {
            Logger.debug('findOne Query Fail By : ' + err.stack);
            return null;
        }
    };

    find = async (tblName: string, whereObj?: any, selectList?: string[], addOption?: string): Promise<object> => {
        try {

            const targetQuery = this.getSelectQuery(tblName, whereObj, selectList, addOption);

            Logger.debug('findOne Query is : ' + targetQuery);

            const resultSet: any = await this.executeQuery(targetQuery);

            if (!resultSet)
                return null;

            Logger.debug('findOne Query Result : ' + JSON.stringify(resultSet));

            return resultSet;

        } catch (err) {
            Logger.debug('Query Is Occured By : ' + err.stack);
            return null;
        }
    };


    async MultiJoin(joinType: string, joinQuery: any, outerTblName: string, joinTargetList: string[], outerSelectList?: string[], outerWhere?: Record<string, any>, addOption?: string, onlyOne?: false): Promise<number> {
        try {

            let targetQuery = `
                SELECT j.${this.getSelectTargetQuery(outerSelectList)}, i.*
                FROM (
                    ${joinQuery}
                ) i
                ${joinType} JOIN ${outerTblName} j ON `;

            let andFlag = false;

            for (const targetObj of joinTargetList) {
                if(andFlag)
                    targetQuery += ` AND`;

                targetQuery +=  ` j.${targetObj} = i.${targetObj}`;
                andFlag = true;
            }

            if(addOption)
                targetQuery += addOption;

            const resultSet: any = await this.executeQuery(targetQuery);

            Logger.debug('findOne Query Result : ' + JSON.stringify(resultSet));

            if(onlyOne)
                return resultSet[0];

            return resultSet;

        } catch (err) {
            Logger.debug('Insert Query Fail By : ' + err.stack);
            return null;
        }
    };


    async Join(joinType:string, subTblName: string, outerTblName: string, joinTargetList: string[], addOption?: string, subWhere?: Record<string, any>, subSelectList?: string[],
                outerSelectList?: string[], outerWhere?: Record<string, any>, onlyQuery?: false, onlyOne?: false): Promise<any> {
        try {

            if(outerSelectList.length === 0) {
                Logger.info("Join Query: Select statement is required.");
                return false;
            }

            // 서브쿼리
            const subSelectQuery = this.getSelectQuery(subTblName, subWhere, subSelectList);
            
            let targetQuery = `
                SELECT ${this.getSelectTargetQuery(outerSelectList)}, i.*
                FROM (
                    ${subSelectQuery}
                ) i
                ${joinType} JOIN ${outerTblName} j ON `;

            let andFlag = false;

            for (const targetObj of joinTargetList) {
                if(andFlag)
                    targetQuery += ` AND`;

                targetQuery +=  ` j.${targetObj} = i.${targetObj}`;
                andFlag = true;
            }

            if(addOption)
                targetQuery += addOption;


            if(onlyQuery)
                return targetQuery;

            const resultSet: any = await this.executeQuery(targetQuery);

            Logger.debug('findOne Query Result : ' + JSON.stringify(resultSet));

            if(onlyOne)
                return resultSet[0];

            return resultSet;

        } catch (err) {
            Logger.debug('Insert Query Fail By : ' + err.stack);
            return null;
        }
    };

    async Insert(tblName: string, insertObj: any): Promise<number> {
        try {
            const insertQuery: string = this.getInsertQuery(tblName, insertObj);

            Logger.debug('Insert Query is : ' + insertQuery);

            const insertResult: any = await this.executeQuery(insertQuery);

            Logger.debug('Insert Query Result : ' + JSON.stringify(insertResult));

            if(insertResult && !insertResult.affectedRows)
                return null;

            if(insertResult.insertId)
                return insertResult.insertId;
            else
                return insertResult.affectedRows;

        } catch (err) {
            Logger.debug('Insert Query Fail By : ' + err.stack);
            return null;
        }
    };

    Delete = async (tblName: string, targetObj: TargetObject): Promise<string> => {
        try {

            const deleteQuery = `DELETE FROM ${tblName}`

            const whereQuery = this.getWhereQuery(targetObj)

            const targetQuery = deleteQuery + whereQuery;

            Logger.debug('delete Query is : ' + targetQuery);

            const resultSet: any = await this.executeQuery(targetQuery);

            Logger.debug('delete Query Result : ' + JSON.stringify(resultSet));

            if(!resultSet.affectedRows)
                return null;

            return resultSet;

        } catch (err) {
            Logger.debug('Query Select Fail');
            return null;
        }
    };


    Update = async (tblName: string, updateObj: any, targetObj: TargetObject): Promise<string> => {
        try {

            const selectQuery = `UPDATE ${tblName} SET ${Object.entries(updateObj).map(([k, v]) => `${k} = ${(v as any)[0] === '\\' ? (v as any).slice(1) : escape(v)}`).join(', ')}`

            const whereQuery = `WHERE ${(this.getWhereQuery(targetObj))}`;

            const targetQuery = selectQuery + whereQuery;

            Logger.debug('update Query is : ' + targetQuery);

            const resultSet: any = await this.executeQuery(targetQuery);

            Logger.debug('update Query Result : ' + JSON.stringify(resultSet));

            if(!resultSet.affectedRows)
                return null;

            return resultSet;

        } catch (err) {
            Logger.debug(err);
            return null;
        }
    };


    // ==== InsertQuery ====

    getSelectQuery(tblName: string, whereObj: Record<string, any>, selectList:string[], addOption?: string): string {

        let selectQuery: string = `SELECT `;

        if(selectList)
            selectQuery += this.getSelectTargetQuery(selectList);
        else
            selectQuery += ` * `

        selectQuery += ` FROM ${tblName}`;

        let whereQuery: string = ``;

        if (whereObj)
            whereQuery = this.getWhereQuery(whereObj);

        if(!addOption)
            addOption = ``;

        const targetQuery = selectQuery + whereQuery + addOption;

        return targetQuery

    }

    getWhereQuery(whereObj: Record<string, any>): string {

        let whereQuery = ` WHERE 1 = 1 `;

        for (const targetObj in whereObj) {
            if (EncryptColumns.includes(targetObj))
                whereQuery +=  `AND CAST(AES_DECRYPT(UNHEX(${targetObj}), ${escape(Config.DB[RUN_MODE].SECURITY.KEY)}) AS CHAR) = ${escape(whereObj[targetObj])}`
            else
                whereQuery += ` AND ${targetObj} = ${escape(whereObj[targetObj])}`
        }

        return whereQuery;

    }

    getSelectTargetQuery(selectList?: string[]): string {

        let selectQuery = ``;

        if(!selectList) {
            selectQuery = ` * `;
        } else {
            for (const targetObj of selectList) {
                if (EncryptColumns.includes(targetObj))
                    selectQuery += `CAST(AES_DECRYPT(UNHEX(${targetObj}), ${escape(Config.DB[RUN_MODE].SECURITY.KEY)}) AS CHAR) as ${targetObj} ,`
                else
                    selectQuery += `${targetObj} ,`

            }

            if(selectQuery.slice(-1) === `,`)
                selectQuery = selectQuery.slice(0, -1);
        }

        return selectQuery;

    }

    // ==== InsertQuery ====
    // 이부분은 다중 INSERT 되도록 수정이 필요할듯함
    getInsertQuery(tblName: string, insertObj: any, option: string = ""): string {
        try {

            let insertQuery = `${option === `REPLACE` ? `${option} INTO ${tblName}  ( ` : `INSERT ${option} INTO ${tblName}   (`}`    //option === "REPLACE" ? option : `INSERT ${option} INTO ${tblName}  (`;


            for(const key of Object.keys(insertObj)) {
                insertQuery += key + " ,"
            }

            insertQuery = insertQuery.slice(0, -1) + ") VALUES (";

            let flag = true;
            for (const targetObj in insertObj) {
                if (EncryptColumns.includes(targetObj))
                    insertQuery += `${flag ? `` : `,`} HEX(AES_ENCRYPT(${escape(insertObj[targetObj])}, ${escape(Config.DB[RUN_MODE].SECURITY.KEY)}))`
                else
                    insertQuery += ` ${flag ? `` : `,`} ${escape(insertObj[targetObj])}`
                flag = false;
            }

            insertQuery += ")";
            return insertQuery;

        } catch (err) {
            Logger.debug('Query Insert Fail');
            return null;
        }
    };

    getUpdateQuery = (tblName: string, updateObj: any, targetObj: TargetObject): string => {
        try {

            const selectQuery = `UPDATE ${tblName} SET ${Object.entries(updateObj).map(([k, v]) => `${k} = ${(v as any)[0] === '\\' ? (v as any).slice(1) : escape(v)}`).join(', ')}`

            const whereQuery = `WHERE ${(this.getWhereQuery(targetObj))}`;

            const targetQuery = selectQuery + whereQuery;

            return targetQuery;

        } catch (err) {
            Logger.debug(err);
            return null;
        }
    };


}

// Example usage
const dbConfig: DBConfig = {
    host: Config.DB[RUN_MODE].MYSQL.HOST,
    port: Config.DB[RUN_MODE].MYSQL.PORT,
    user: Config.DB[RUN_MODE].MYSQL.USER,
    password: Config.DB[RUN_MODE].MYSQL.PASSWORD,
    database: 'nodejs',
    multipleStatements: true
};

export default new DBHelper(dbConfig);
