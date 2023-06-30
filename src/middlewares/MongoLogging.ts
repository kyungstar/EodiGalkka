import { Request, Response, NextFunction } from 'express';
import Mongo from "../modules/Mongo";
import Logger from "../modules/Logger";
import Config from "../../config";


// todo KYG :  몽고 커넥션 없을 떄도 처리하도록 해야한다.
// todo docker : 몽고 자동 실행 확인하기.
// todo 완전 개선 필요
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
        // 여기서 적절한 에러 처리를 수행하거나, 대체 로깅 메커니즘을 사용할 수 있습니다.
    }
};


export default logger;
