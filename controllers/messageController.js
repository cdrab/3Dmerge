const { messages, users } = require("../database/models");
const { Op, Sequelize } = require("sequelize");
require("dotenv").config();

const addMessage = async (req, res) => {
  const { sender, receiver, text } = await req.body;

  let img, message;
  if (req?.files?.file) {
    if (req.files.file[0].mimetype.split("/")[0] == "image") {
      img = `${process.env.SERVER_PATH}/img/file/${req.files.file[0].filename}`;
    }
  }

  if ((sender, receiver, text)) {
    message = await messages.create({
      sender,
      receiver,
      text,
    });

    if (img) message.img = img;

    await message.save();

    if (message) {
      res.json("message envoyé");
    }
  }
};

const getMessage = async (req, res) => {
  const { receiver } = await req.body;

  if (!receiver || receiver == null || receiver == undefined)
    return res.json("No sender");

  const getMessages = await messages.findAll({
    where: {
      [Op.or]: [
        {
          sender: req.user,
          receiver: receiver,
        },
        {
          sender: receiver,
          receiver: req.user,
        },
      ],
    },
    include: [
      {
        model: users,
        as: "send",
        attributes: ["name", "avatar", "ID_user"],
      },
      {
        model: users,
        as: "receive",
        attributes: ["name", "avatar", "ID_user"],
      },
    ],
    attributes: [
      [Sequelize.literal("DATE(messages.createdAt)"), "date"],
      [Sequelize.literal("TIME(messages.createdAt)"), "time"],
      "text",
      "img",
    ],
    order: [[Sequelize.col("messages.createdAt"), "ASC"]],
  });

  await messages.update(
    { unRead: false },
    {
      where: {
        unRead: true,
        sender: receiver,
      },
    }
  );

  res.json(getMessages);
};

const getLastMessage = async (req, res) => {
  const lastMessage = await messages.findAll({
    where: {
      [Op.or]: [{ sender: req.user }, { receiver: req.user }],
    },
    include: [
      {
        model: users,
        as: "send",
        attributes: ["name", "avatar", "ID_user"],
      },
      {
        model: users,
        as: "receive",
        attributes: ["name", "avatar", "ID_user"],
      },
    ],
    order: [[Sequelize.col("messages.createdAt"), "DESC"]],
  });

  res.json(lastMessage);
};

const getUsers = async (req, res) => {
  const user = await messages.findAll({
    where: {
      [Op.or]: [{ sender: req.user }, { receiver: req.user }],
    },
    include: [
      {
        model: users,
        as: "send",
        attributes: ["name", "avatar", "ID_user"],
      },
      {
        model: users,
        as: "receive",
        attributes: ["name", "avatar", "ID_user"],
      },
    ],
    order: [[Sequelize.col("messages.createdAt"), "DESC"]],
  });

  const allUserAvecDoublons = user.map((item) => {
    if (item.send.ID_user == req.user) {
      return {
        ID_user: item.receive.ID_user,
        avatar: item.receive.avatar,
        name: item.receive.name,
      };
    } else {
      return {
        ID_user: item.send.ID_user,
        avatar: item.send.avatar,
        name: item.send.name,
      };
    }
  });

  const allUser = [];

  const objetsUniques = new Set();

  allUserAvecDoublons.forEach((objet) => {
    const cleObjet = `${objet.ID_user}`;
    if (!objetsUniques.has(cleObjet)) {
      objetsUniques.add(cleObjet);
      allUser.push(objet);
    }
  });

  const use = await users.findAll({
    include: [
      {
        model: messages,
      },
    ],
    where: {
      role: process.env.PRIME3,
    },
  });

  res.json(allUser);
};

const getMessageNotif = async (req, res) => {
  const receiveMessage = await messages.findAll({
    where: {
      unRead: true,
      receiver: req.user,
    },
    attributes: [
      "sender",
      "receiver",
      "createdAt",
      [Sequelize.fn("COUNT", Sequelize.col("ID_message")), "count"],
    ],
    include: [
      {
        model: users,
        as: "send",
        attributes: ["ID_user", "name", "email"],
      },
    ],
    group: ["sender"],
    order: [[Sequelize.col("messages.createdAt"), "DESC"]],
  });

  res.json(receiveMessage);
};

module.exports = {
  addMessage,
  getMessage,
  getLastMessage,
  getUsers,
  getMessageNotif,
};
