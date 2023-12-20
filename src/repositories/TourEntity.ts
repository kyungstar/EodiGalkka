
export enum orderType {
    ASC = 'ASC',
    DESC = 'DESC',
}


const tourClientSchema = {
    defaultStringSchema: {
        type: 'string',
    },
    defaultNumberSchema: {
        type: 'number',
    },
    orderSchema: {
        type: 'string',
        enum: Object.values(orderType)
    },
    userIdSchema: {
        type: 'string',
        minLength: 8,
        maxLength: 50
    }
};

export const continentsSchema = {
    type: 'object',
    properties: {
        worldSeq: tourClientSchema.defaultNumberSchema,
    },
    required: ["worldSeq"],
};

export interface continentsInterface {
    worldSeq: number
};

export const countrySchema = {
    type: 'object',
    properties: {
        continentsSeq: tourClientSchema.defaultNumberSchema,
    },
    required: ["continentsSeq"],
};


export const citySchema = {
    type: 'object',
    properties: {
        countrySeq: tourClientSchema.defaultNumberSchema,
    },
    required: ["countrySeq"],
};

export interface cityInterface {
    countrySeq: number
};

export const crawlerSchema = {
    type: 'object',
    properties: {
        targetKeyword: tourClientSchema.defaultStringSchema,
        sort: tourClientSchema.orderSchema,
        page: tourClientSchema.defaultNumberSchema
    },
    required: ["targetKeyword", "sort", "page"],
};


export interface countryInterface {
    continentsSeq: number
};

export interface crawlerInterface {
    targetKeyword: string,
    sort: string,
    page: number
};