import { Request, Response, NextFunction } from 'express';
import Mongo from "../modules/Mongo";
import Logger from "../modules/Logger";
import Config from "../../config";


const logger = async (req: Request, res: Response) => {
    const { method, url, body, query, params } = req;
    const { statusCode, statusMessage } = res;
    const headers = res.getHeaders();

    try {
        const db = await Mongo();
        if (!db) {
            throw new Error('DB connection is not available');
        }

        const collection = db.collection('log_reply_' + Config.SERVER_TYPE.toLowerCase());

        const log = {
            method,
            path: '/api' + url,
            body,
            query,
            params,
            response: {
                statusCode,
                statusMessage,
                headers,
                data: res.locals.data
            },
            timestamp: new Date(),
        };

        const result = await collection.insertOne(log);

        if (result.acknowledged === true) {
            Logger.info('API log saved to MongoDB');
        } else {
            Logger.error('Failed to save API log to MongoDB');
        }
    } catch (err) {
        Logger.error('Failed to connect to MongoDB:', err);
    }
};


export default logger;
