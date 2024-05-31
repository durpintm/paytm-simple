const express = require("express");
import rootRouter from "./routes/router";

const PORT = 3000;

const app = express();

app.use("api/v1", rootRouter);
app.use(express.json());

app.listen(PORT, () => {
  console.log("Connected...");
});
