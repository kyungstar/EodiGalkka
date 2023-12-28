

const chatSchema = {
    defaultSchema: {
        type: 'string'
    }, chatRoomSchema: {
        type: 'string',
        minLength: 1,
        maxLength: 50
    }
}


export interface chatRoomInterface {
    userId: string,
    userIds: string,
    chatRoomName: string
};

export interface chatUserInterface {
    userId: string
};

export const chatRoomSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema,
        userIds: chatSchema.defaultSchema,
        chatRoomName: chatSchema.chatRoomSchema
    },
    required: ["userId", "chatRoomName"]
};

export const chatUserSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema
    },
    required: ["userId"]
};
