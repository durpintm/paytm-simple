const { Router } = require("express");
import zod from "zod";
import Users from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRouter = Router();

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

userRouter.post("signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid object",
    });
  }

  const existingUser = Users.findOne({ username: req.body.username });

  if (existingUser) {
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

  const token = jwt.sign({ userId }, JWT_SECRET);

  return res.json({
    message: "User created successfully!",
    token: token,
  });
});

userRouter.post("signin", (req, res) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid object",
    });
  }

  const existingUser = Users.findOne({
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

module.exports = userRouter;
