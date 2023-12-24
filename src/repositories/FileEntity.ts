
const fileClientSchema = {
    defaultStringSchema: {
        type: 'string',
    },
    defaultNumberSchema: {
        type: 'number',
    },
    fileSchema: {
        type: 'object'
    },
    userIdSchema: {
        type: 'string',
        minLength: 8,
        maxLength: 50
    }
};

export interface imageInterface {
    file: string,
    fileSeq?: number,
    fileDir: string,
    fileType?: string,
    userId: string
};

// 파일
export const imgUploadSchema = {
    type: 'object',
    properties: {
        file: fileClientSchema.fileSchema,
        fileDir: fileClientSchema.defaultStringSchema,
        fileType: fileClientSchema.defaultStringSchema,
        userId: fileClientSchema.userIdSchema
    },
    required: ["file", "fileDir", "userId"]
};

export const imgDownSchema = {
    type: 'object',
    properties: {
        fileSeq: fileClientSchema.defaultNumberSchema,
        filePath: fileClientSchema.defaultStringSchema,
        userId: fileClientSchema.userIdSchema
    },
    required: ["userId"]
};




