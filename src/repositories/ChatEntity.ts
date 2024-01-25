

const chatSchema = {
    defaultSchema: {
        type: 'string'
    }, chatRoomSchema: {
        type: 'string',
        minLength: 1,
        maxLength: 50
    }, chatRoomSeq: {
        type: 'number',
        minLength: 1,
        maxLength: 10
    }
}


export interface chatRoomInterface {
    userId?: string,
    userIds?: string,
    chatRoomName?: string,
    chatRoomSeq?: number,
};

export interface chatUserInterface {
    userId: string
};


export const chatRoomSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema,
        userIds: chatSchema.defaultSchema,
        chatRoomName: chatSchema.chatRoomSchema,
        chatRoomSeq: chatSchema.chatRoomSeq
    },
    required: ["userId", "chatRoomName"]
};

export const chatRoomMemberSchema = {
    type: 'object',
    properties: {
        chatRoomSeq: chatSchema.chatRoomSeq
    },
    required: ["chatRoomSeq"]
};


export const chatUserSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema
    },
    required: ["userId"]
};
