"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileController_1 = __importDefault(require("./FileController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**File**/
// 이미지 업로드
router.post("/img/upload", FileController_1.default.imageUpload);
// 이미지 다운로드
router.get("/img/download", FileController_1.default.imageDown);
exports.default = router;
//# sourceMappingURL=index.js.map