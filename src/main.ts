
const schedule = require('node-schedule');

import Config from "../config";

import DFSLoader from "./ServerLoader/Target/DFS";
import DBLoader from "./ServerLoader/Target/Mysql";
import MQTTLoader from "./ServerLoader/Target/MQTT";
import TOURLoader from "./ServerLoader/Target/TOUR";
import CHATLoader from "./ServerLoader/Target/CHAT";


import Logger from "./modules/Logger";
import MQTT from "./ServerLoader/Target/MQTT";


import SchedulerService from "../src/routers/service/scheduler/SchedulerService";

(async function () {

    if(["SCHEDULER", "TOUR", "FMS", "MQTT", "CHAT"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info('DB Is Loading')

        await DBLoader();
    }


    if(['SCHEDULER'].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')

        // Scheduler Job Start
        schedule.scheduleJob('0 0 * * *', SchedulerService.updateTodayCount);
    }

    // Chat Service
    if (["CHAT"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading');

        await CHATLoader();
    }


    // Tour Service
    if (["TOUR"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading');

        await TOURLoader();
    }

    // 파일
    if (["FMS"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading');

        await DFSLoader();
    }

    // MQTT Messaging Protocol
    if (["MQTT"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading');

        await MQTTLoader();
    }


})();
