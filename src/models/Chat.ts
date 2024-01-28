import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
        chat: String,
        chat_room_seq: Number,
        chat_key: String,
        user: {
            userId: String
        },
    }, { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
