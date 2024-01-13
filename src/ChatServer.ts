
import {createServer} from "http";
import formData from "express-form-data";

import Config, {RUN_MODE} from "../config";
import {MONGO_SERVER} from "../config/Security";
import app from "./modules/MongoLoader"
import ioHandler from "./modules/ioHandler"
import {Server} from "socket.io";
import Logger from "./modules/Logger";
import router from "./routers/api";


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin:`http://localhost:${MONGO_SERVER.WEB_PORT}`
    }
});


//파일 업로드를 위해 요청 본문을 파싱하는 미들웨어를 등록하고, 설정을 지정합니다.
app.use(formData.parse({
    //uploadDir: Config.DEFAULT_FILE_PATH, // 업로드 된 파일을 저장할 디렉토리를 설정
    autoClean: true, // 요청이 완료된 후 임시 파일을 자동으로 삭제
    maxFilesSize: 1024 * 1024 * 1024, // 전송되는 파일의 최대 크기를 설정
}));

// 파일 업로드를 위한 미들웨어를 등록합니다.
// 미들웨어와 함께 사용되며, 다중 파일 업로드를 지원하기 위해 사용됩니다. 이 미들웨어는 파싱된 파일들을 하나의 객체로 병합하여 req.body에 저장합니다.
app.use(formData.union());

// Restful Routing
app.use("/", router);

// todo 추가 수정 필요
ioHandler(io);

// Socker Server
httpServer.listen(MONGO_SERVER.PORT, () => {
    Logger.info(`[${RUN_MODE}] : Chat Server Listening on Port : ` +  MONGO_SERVER.PORT);
})

