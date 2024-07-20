if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routers");
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.send({
    message: "The service is ready!",
    author: "Aldo Marcelino",
    project: "user-login",
  });
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
