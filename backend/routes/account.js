const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { Accounts } = require("../db");
const zod = require("zod");
const mongoose = require("mongoose");

const accountRouter = Router();

const accountBody = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  const account = await Accounts.findOne({
    userId: userId,
  });

  if (!account) {
    return res.status(411).json({
      message: "No account data",
    });
  }
  console.log(account.balance);

  return res.status(200).json({
    balance: account.balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const { success } = accountBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid request",
    });
  }

  const { amount, to } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  const senderAccount = await Accounts.findOne({
    userId: req.userId,
  }).session(session);

  if (!senderAccount.balance || senderAccount.balance < amount) {
    (await session).abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const receiverAccount = await Accounts.findOne({
    userId: to,
  }).session(session);

  if (!receiverAccount.balance) {
    (await session).abortTransaction();
    return res.status(400).json({
      message: "Invalid receiving account",
    });
  }

  // Perform the transfer
  await Accounts.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: { balance: -amount },
    }
  ).session(session);

  await Accounts.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  (await session).commitTransaction();

  res.status(200).json({
    message: "Transfer Successful",
  });
});

module.exports = accountRouter;
