
import { Repository } from 'typeorm';
import {AppDataSource} from "./DBConfig";
import {chattingRoom} from "../entities/Chat";
import Logger from "./Logger";
export default class DBHelper_B {

    public static async getConnection(Repo: Function) {
        const Repository = AppDataSource.getRepository(Repo);
        return Repository;
    }

    public static async findOne(Repo: Function, whereObj: object) {

        const Repository = await this.getConnection(Repo);

        const targetObj = await Repository.findOneBy(whereObj);

        Logger.info(JSON.stringify(targetObj) + "??");

        await Repository.clear();

        return targetObj;
    }

    public static async insert(Repo: Function, insertObj: object) {
        const Repository = await this.getConnection(Repo);

        await Repository.save(insertObj)

        await Repository.clear();
    }

    public static async delete(Repo: Function, whereObj: object) {

        try {
            const Repository = await this.getConnection(Repo);

            await Repository.delete(whereObj)

            await Repository.clear();

            return true;
        } catch (err) {
            Logger.error(err.stack);
            return null;
        }

    }

    public static async update(Repo: Function, updateObj: object, whereObj: object) {

        try {
            const Repository = await this.getConnection(Repo);

            await Repository.update(updateObj, whereObj);

            await Repository.clear();

            return true;
        } catch (err) {
            Logger.error(err.stack);
            return null;
        }
    }


}