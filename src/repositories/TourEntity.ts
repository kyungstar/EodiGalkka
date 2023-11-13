

export enum orderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

const numberSchema = {
    type: 'number'
};

const stringSchema = {
    type: 'string'
};

const orderSchema = {
    type: 'string',
    enum: Object.values(orderType)
}



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

export const crawlerSchema = {
    type: 'object',
    properties: {
        targetKeyword: stringSchema,
        sort: orderSchema,
        page: numberSchema,
    },
    required: ["targetKeyword", "sort", "page"],
};

export interface crawlerInterface {
    targetKeyword: string,
    sort: string,
    page: number
};