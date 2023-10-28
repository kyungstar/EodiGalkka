

const userIdSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 50
};

// 파일 Dir
const fileDirSchema = {
    type: 'string'
};

const fileSchema = {
    type: 'object'
};


const fileSeqSchema = {
    type: 'number'
};

const filePathSchema = {
    type: 'string'
};

const fileTypeSchema = {
    type: 'string'
};

// 회원가입
export const imgUploadSchema = {
    type: 'object',
    properties: {
        file: fileSchema,
        fileDir: fileDirSchema,
        fileType: fileTypeSchema,
        userId: userIdSchema
    },
    required: ["file", "fileDir", "userId"]
};

export const imgDownSchema = {
    type: 'object',
    properties: {
        fileSeq: fileSeqSchema,
        filePath: filePathSchema,
        userId: userIdSchema
    },
    required: ["userId"]
};

export interface imageUploadInterface {
    file: string,
    fileDir: string,
    fileType: string,
    userId: string
};


export interface imageDownInterface {
    fileSeq: number,
    filePath: string,
    userId: string
};