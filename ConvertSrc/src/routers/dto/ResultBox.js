"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResultBox {
    static JustPropertyValue(result, property) {
        return { result, property };
    }
    static JustFalse(code) {
        return { result: false, code: code };
    }
    static JustTrue(code) {
        return { result: true, code: code };
    }
    static JustErr(err) {
        err = err.substring(0, 10);
        return { result: false, code: '03', err: err + ' Is Occurred' };
    }
}
exports.default = ResultBox;
//# sourceMappingURL=ResultBox.js.map