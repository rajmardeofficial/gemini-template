const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/Messagemodel");
const users = require("../models/userSchema");

const Chat = require("../models/ChatModel");

const sendMessage = expressAsyncHandler(async(req,res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed")
        return res.sendStatus(400)
    }
    var newMessage = {
        sender:req.user._id,
        content: content,
        chat:chatId,

    }
    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name")
        message = await message.populate("chat")
        message = await users.populate(message, {
            path: "chat.users",
            select:"name email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage:message,
        })
        res.json(message);  
    } catch (e) {
        res.sendStatus(400);
        console.log(e);    
    }
})

const allMessages = expressAsyncHandler(async(req,res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat")
        res.json(messages)
    } catch (error) {
        res.sendStatus(400);
        console.log(error);   
    }
})
module.exports = { sendMessage, allMessages };