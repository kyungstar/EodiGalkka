import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Chat", userSchema);