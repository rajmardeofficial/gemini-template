const asyncHandler = require("express-async-handler");
const chat = require("../models/ChatModel");
const User = require("../models/userSchema");
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userid param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chat
    .find({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await chat.create(chatData);
      const fullChat = await chat
        .findOne({ _id: createChat._id })
        .populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (e) {
      console.log(e);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    chat
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

module.exports = { accessChat, fetchChats };
