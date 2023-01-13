const { User } = require("../schemas/user.schema");

const verifyUser = async (req, res, next) => {
  try {
    const userId = req.headers.authorization;
    const { id } = req.params;
    if (userId) {
      const foundUser = await User.find({ _id: userId });
      if (foundUser[0].personalDetails.handleName === id) {
        req.userId = userId;
        next();
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { verifyUser };
