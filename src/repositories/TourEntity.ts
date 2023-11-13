
// 유저타입명시
import crypto from "crypto-js";
import Config, {RUN_MODE} from "../../config";


// 지구본
const numberSchema = {
    type: 'number'
};

// 대륙 목록



// 로그인
export const continentsSchema = {
    type: 'object',
    properties: {
        worldSeq: numberSchema,
    },
    required: ["worldSeq"],
};

export interface continentsInterface {
    worldSeq: number
};

export const countrySchema = {
    type: 'object',
    properties: {
        continentsSeq: numberSchema,
    },
    required: ["continentsSeq"],
};

export interface countryInterface {
    continentsSeq: number
};

export const citySchema = {
    type: 'object',
    properties: {
        countrySeq: numberSchema,
    },
    required: ["countrySeq"],
};

export interface cityInterface {
    countrySeq: number
};