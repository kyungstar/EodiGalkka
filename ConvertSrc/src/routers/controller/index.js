"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = __importDefault(require("../../../config"));
const index_1 = __importDefault(require("../../routers/controller/User/index"));
const router = (0, express_1.Router)();
if (config_1.default.SERVER_TYPE === "USER") {
    router.use("/api", index_1.default);
}
exports.default = router;
//# sourceMappingURL=index.js.map