const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth.routes.js");
const interviewRouter = require("./routes/interview.routes.js");
const errorMiddleware = require("./middlewares/error.middleware.js");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Must be last
app.use(errorMiddleware);

module.exports = app;