const { User } = require("../schemas/user.schema");
const sign = require("jwt-encode");
const { sendVerificationEmail } = require("../utils/verificationMail");

const isUserEmailVerified = async (req, res, next) => {
  try {
    const { email } = req.body;
    const foundUser = await (
      await User.find({})
    ).filter((user) => user.personalDetails.email === email)[0];
    console.log(foundUser);
    if (foundUser.isUserVerified) {
      next();
    } else {
      const encodedToken = sign(
        { _id: foundUser._id, email: foundUser.email },
        process.env.USER_PWD_SECRET,
        { expiresIn: "24h" }
      );
      if (sendVerificationEmail(email, encodedToken)) {
        res.status(401).json({
          success: false,
          message: "Email not verified. Please verify your email first.",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "User not verified. Please try again later.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = { isUserEmailVerified };
