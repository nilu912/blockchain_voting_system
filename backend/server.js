const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const { userRoutes } = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server Error!",
  });
});

app.listen(process.env.port, () => {
  console.log("server is running on port", port);
});
