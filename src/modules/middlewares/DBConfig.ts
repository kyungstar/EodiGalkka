import "reflect-metadata"
import { DataSource } from "typeorm"
import Logger from "./Logger";
import * as path from "path";
import Config, {RUN_MODE} from "../../../config";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: Config.DB[RUN_MODE].MYSQL.HOST,
    port: Config.DB[RUN_MODE].MYSQL.PORT,
    username: Config.DB[RUN_MODE].MYSQL.USER,
    password: Config.DB[RUN_MODE].MYSQL.PASSWORD,
    database: "nodejs",
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, "../../entities/*.ts")],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => {Logger.info("AppDataSource is Loaded")})
    .catch((error) => Logger.error(error.message))