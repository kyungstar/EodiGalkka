import mariadb, {PoolCluster, PoolConnection} from "mariadb";
import Logger from '../modules/Logger';
import Config, {RUN_MODE} from "../../config";

interface DBConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

class MariaDB {
    private cluster: PoolCluster;

    constructor(Config: DBConfig) {
        this.cluster = mariadb.createPoolCluster({
            removeNodeErrorCount: 5,
            restoreNodeTimeout: 5000
        });

        this.cluster.add('master', {
            host: Config.host,
            port: Config.port,
            user: Config.user,
            password: Config.password,
            database: Config.database,
        });

    }

    public getCluster(): PoolCluster {
        return this.cluster;
    }

    public async getConnection(retry = 3): Promise<PoolConnection> {
        try {
            const connection= this.getCluster();

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

            Logger.debug(statement);

            await conn.commit();
            await conn.release();

            if ("INSERT".includes(statement))
                return result[0].insertId;

            return result[0]

        } catch (err) {
            Logger.debug('Query Select Fail', err);
            await conn.release();
            return null;
        }
    }

    async beginTransaction(statement: string[]) {

        let conn = await this.getConnection();

        try {
            await conn.beginTransaction();

            let result = await conn.query(statement.join(" ; "));

            Logger.debug(statement.join(" ; "));

            await conn.commit();
            await conn.release();

            return result;

        } catch (err) {
            await conn.rollback();
            await conn.release();
            Logger.debug('beginTransaction Fail', err);
        }
    }


}

// Example usage
const dbConfig: DBConfig = {
    host: Config.DB[RUN_MODE].MYSQL.HOST,
    port: Config.DB[RUN_MODE].MYSQL.PORT,
    user: Config.DB[RUN_MODE].MYSQL.USER,
    password: Config.DB[RUN_MODE].MYSQL.PASSWORD,
    database: 'nodejs'
};

export default new MariaDB(dbConfig);
