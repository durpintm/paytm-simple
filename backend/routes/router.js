const { Router } = require("express");
const userRouter = require("./user");

const rootRouter = Router();

rootRouter.use("/user", userRouter);

module.exports = rootRouter;
