

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
    chatRoomName: string
};

export const chatRoomSchema = {
    type: 'object',
    properties: {
        userId: chatSchema.defaultSchema,
        chatRoomName: chatSchema.chatRoomSchema
    },
    required: ["userId", "chatRoomName"]
};


