const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const { userRoutes } = require("./routes/userRoutes");
const { default: mongoose } = require("mongoose");

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server Error!",
  });
});

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(process.env.PORT);
  console.log("server is running on port", process.env.PORT);
}

main();
