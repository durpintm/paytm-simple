const express = require("express");
const rootRouter = require("./routes/router");
const cors = require("cors");

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log("Connected...");
});
