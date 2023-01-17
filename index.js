const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.set("json spaces", 4);
app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

const { connectDB } = require("./db/db.connect.js");

const { authV1 } = require("./routes/auth.route.js");
const { profileV1 } = require("./routes/profile.route.js");

connectDB();
const { DocsObj } = require("./utils");
const { postsV1 } = require("./routes/post.route.js");

app.get("/", (req, res) => {
  res.json({ ...DocsObj });
});

app.use("/api/v1/auth", authV1);
app.use("/api/v1/user", profileV1);
app.use("/api/v1/posts", postsV1);

/**
 * 404 Route Handler
 * Note: DO not MOVE. This should be the last route
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check",
  });
});

/**
 * Error Handler
 * Don't move
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occured, see the errMessage key for more details",
    errorMessage: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
