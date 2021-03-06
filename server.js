const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

//import authRoutes
const authRoutes = require("./routes/auth");

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((e) => {
    console.log("Database connection error", e);
  });

//middlwares

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//prefixing all the routes with "/api"
// app.use("/api", authRoutes);

//reading all routes synchronously and loading
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

//port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server running on PORT:", PORT));
