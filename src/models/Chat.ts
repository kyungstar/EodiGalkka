import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
        chat: String,
        user: {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "ChatUser"
            },
            name: String
        },
    }, { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
