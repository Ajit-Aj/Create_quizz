const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const questionRoutes = require("./routes/questionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const CONNECTION_URL = "mongodb://localhost:27017/quiz";
const PORT = 5000;

app.use("/api", questionRoutes);

mongoose
  .connect(CONNECTION_URL, console.log("mongo Db connected"))
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
