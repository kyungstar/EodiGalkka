import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Config.json 파일 가져오기
import Config, {RUN_MODE} from "../../config";
import {MONGO, MongoDatabase} from "../../config/Security";
import Logger from "./Logger";

const app = express();
app.use(cors());

const dbUri = `${MONGO.URL}/${MongoDatabase.CHAT}`; // 실제 데이터베이스 URI로 교체
mongoose.connect(dbUri)
    .then(() => {
        Logger.info(`[${RUN_MODE}] DataBase is Loaded`);
    })
    .catch((err) => {
        Logger.info("Error is Occured By ", err);
    });

export default app;

