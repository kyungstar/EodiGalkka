
const schedule = require('node-schedule');

import Config from "../config";

import DFSLoader from "./ServerLoader/Target/DFS";
import DBLoader from "./ServerLoader/Target/Mysql";
import MQTTLoader from "./ServerLoader/Target/MQTT";
import TOURLoader from "./ServerLoader/Target/TOUR";

import Logger from "./modules/Logger";
import MQTT from "./ServerLoader/Target/MQTT";


import SchedulerService from "../src/routers/service/scheduler/SchedulerService";

(async function () {

    if(['SCHEDULER'].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        await DBLoader();

        // Scheduler Job Start
        schedule.scheduleJob('0 0 * * *', SchedulerService.updateTodayCount);
    }


    // Tour Service
    if (["TOUR"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading');

        await DBLoader();
        await TOURLoader();
    }

    // 파일
    if (["FMS"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        await DBLoader();
        await DFSLoader();
    }

    // MQTT Messaging Protocol
    if (["MQTT"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        await MQTTLoader();
    }


})();
