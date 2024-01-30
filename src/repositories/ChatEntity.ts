

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

export interface chatRoomMemberInterface {
    userIds?: string,
    chatRoomSeq?: number,
}

export interface chatUserInterface {
    userId: string
}

export interface chatMsgInterface {
    userId: string,
    msg: string,
    chatRoomSeq: Number
}


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

export const chatRoomInviteSchema = {
    type: 'object',
    properties: {
        userIds: chatSchema.defaultSchema,
        chatRoomSeq: chatSchema.chatRoomSeq
    },
    required: ["userIds", "chatRoomSeq"]
};


export const chatUserSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema
    },
    required: ["userId"]
};

export const chatSendSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema,
        msg: chatSchema.defaultSchema
    },
    required: ["userId", "msg"]
};