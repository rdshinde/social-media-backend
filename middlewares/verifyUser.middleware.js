const { User } = require("../schemas/user.schema");
const unsign = require("jwt-decode");
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.params;
    const encodedToken = unsign(token, process.env.USER_PWD_SECRET);
    if (encodedToken._doc._id) {
      const foundUser = await User.find({ _id: encodedToken._doc._id });
      if (foundUser[0].personalDetails.handleName === id) {
        req.userId = foundUser[0].personalDetails.handleName;
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
