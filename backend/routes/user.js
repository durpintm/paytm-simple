const express = require("express");
const zod = require("zod");
const { Users, Accounts } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getRandomBalance } = require("../utils/common");

const userRouter = express.Router();

const signUpBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  first_name: zod.string(),
  last_name: zod.string(),
});

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRouter.post("/signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid object",
    });
  }

  const existingUser = Users.findOne({ username: req.body.username });

  if (existingUser.username) {
    return res.status(411).json({
      message: "User already exists",
    });
  }

  const user = await Users.create({
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  const userId = user._id;

  const newBalance = getRandomBalance();

  await Accounts.create({
    userId: userId,
    balance: newBalance,
  });

  const token = jwt.sign({ userId }, JWT_SECRET);

  return res.json({
    message: "User created successfully!",
    token: token,
  });
});

userRouter.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid object",
    });
  }

  const existingUser = await Users.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!existingUser) {
    return res.status(411).json({
      message: "User not found",
    });
  }

  const userId = existingUser._id;

  const token = jwt.sign({ userId }, JWT_SECRET);

  return res.json({
    token: token,
  });
});

const updateBody = zod.object({
  password: zod.string(),
  first_name: zod.string(),
  last_name: zod.string(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await Users.UpdateOne({ _id: req.userId }, req.body);

  return res.status(200).json({
    message: "User updated successfully",
  });
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const users = await Users.find({
    $or: [
      {
        first_name: {
          $regex: new RegExp(filter, "i"),
        },
      },
      {
        last_name: {
          $regex: new RegExp(filter, "i"),
        },
      },
    ],
  });

  return res.status(200).json({
    users: users.map((user) => ({
      username: user.first_name,
      first_name: user.first_name,
      last_name: user.last_name,
      _id: user._id,
    })),
  });
});

module.exports = userRouter;
