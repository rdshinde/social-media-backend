const { User } = require("../schemas/user.schema");

const verifyUser = async (req, res, next) => {
  const userId = req.headers.authorization.userId;
  const { id } = req.params;
  console.log(userId);
  if (userId) {
    const foundUser = User.find({ _id: userId });
    console.log(foundUser);
    if (foundUser) {
      next();
    }
  }
  res.status(401).json({
    success: false,
    message: "Unauthorized access.",
  });
};

module.exports = { verifyUser };
