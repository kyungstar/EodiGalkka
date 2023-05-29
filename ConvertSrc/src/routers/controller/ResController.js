"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResController {
    clientReqError(res, msg) {
        let dto = {
            result: false,
            code: 'CUP',
            msg: msg
        };
        res.type('application/json');
        return res.status(200).json(dto);
    }
    dataCheck(res, data, msg) {
        let dto = {
            result: false,
            msg: data + msg
        };
        res.type('application/json');
        return res.status(200).json(dto);
    }
    // T는 Type의 약자로 다른 언어에서도 제네릭을 선언할 때 관용적으로 많이 사용된다. 이 부분에는 식별자로 사용할 수 있는 것이라면 무엇이든 들어갈 수 있다.
    true(res, code, dto) {
        if (!dto) { // @ts-ignore
            dto = {};
        }
        // @ts-ignore
        dto.result = true;
        // @ts-ignore
        dto.code = code;
        res.type('application/json');
        return res.status(200).json(dto);
    }
    false(res, code) {
        let dto = {
            result: false,
            code: code
        };
        res.type('application/json');
        return res.status(200).json(dto);
    }
    err(res, code, err) {
        let dto = {
            result: false,
            code: code,
            msg: 'Error Occurred By ' + err
        };
        res.type('application/json');
        return res.status(200).json(dto);
    }
}
exports.default = ResController;
;
//# sourceMappingURL=ResController.js.map