

export enum userType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    AGENCY = 'AGENCY',
}

// 성별
export enum genderType {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

const userClientSchema = {
    default_schema: {
        type: 'string',
    },
    phoneNumberSchema: {
        type: 'string',
        minLength: 8,
        maxLength: 13,
        pattern: '^\\d{3}-\\d{4}-\\d{4}$'
    }, emailSchema: {
        type: 'string',
        minLength: 8,
        maxLength: 45,
        pattern: '[a-z0-9]+@[a-z]+\\.[a-z]{2,3}'
    }, nickNameSchema: {
        type: 'string',
        minLength: 2,
        maxLength: 6,
    }, genderSchema: {
        type: 'string',
        enum: Object.values(genderType)
    }, addressSchema: {
        type: 'string',
        maxLength: 45,
    }, userTypeSchema: {
        type: 'string',
        enum: Object.values(userType)
    }, loginIdSchema: {
        type: 'string',
        minLength: 8,
        maxLength: 12
    }
};




export interface userInterface {
    userId: string
};

export interface userJoinInterface {
    userType: string,
    loginId: string,
    pwd: string,
    email: string,
    name: string,
    nickName: string,
    phoneNumber: string,
    gender: string,
    address: string,
    addressDetail: string
};


// 로그인
export const userLoginSchema = {
    type: 'object',
    properties: {
        loginId: userClientSchema.loginIdSchema,
        pwd: userClientSchema.default_schema,
    },
    required: ["loginId", "pwd"],
};

export interface userLoginInterface {
    loginId: string,
    pwd: string
};

export const userSchema = {
    type: 'object',
    properties: {
        userId: userClientSchema.default_schema
    },
    required: ["userId"]
};



// 회원가입
export const userJoinSchema = {
    type: 'object',
    properties: {
        userType: userClientSchema.userTypeSchema,
        loginId: userClientSchema.loginIdSchema,
        pwd: userClientSchema.default_schema,
        email: userClientSchema.emailSchema,
        name: userClientSchema.default_schema,
        nickName: userClientSchema.nickNameSchema,
        phoneNumber: userClientSchema.phoneNumberSchema,
        gender: userClientSchema.genderSchema,
        address: userClientSchema.addressSchema,
        addressDetail: userClientSchema.addressSchema
    },
    required: ["userType", "loginId", "pwd", "email", "name", "gender"],
};



// 고객정보
export const userInfoSchema = {
    type: 'object',
    properties: {
        userId: userClientSchema.default_schema,
        phoneNumber: userClientSchema.phoneNumberSchema,
        email: userClientSchema.default_schema
    },
    required: ["userId"]
};


export interface userInfoInterface {
    userId: string,
    phoneNumber: string,
    email: string
};



