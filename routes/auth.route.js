const express = require("express");
const sign = require("jwt-encode");
const unsign = require("jwt-decode");
const { sendVerificationEmail } = require("../utils/verificationMail");
const { v4: uuid } = require("uuid");
const authV1 = express.Router();
const {
  isUserEmailVerified,
} = require("../middlewares/verifyUserEmail.middleware");
const { User } = require("../schemas/user.schema");

authV1.route("/login").post(isUserEmailVerified, async (req, res) => {
  try {
    const userData = req.body;
    const foundUser = await User.findOne({
      email: userData.email,
    });
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const foundUserAuthToken = foundUser.personalDetails.password;
    const { password } = unsign(
      foundUserAuthToken,
      process.env.USER_PWD_SECRET
    );
    if (userData.password === password) {
      const encodedToken = sign({ ...foundUser }, process.env.USER_PWD_SECRET, {
        expiresIn: "24h",
      });
      res.json({ success: true, encodedToken });
    } else {
      res.status(401).json({
        success: false,
        message: "Password does not matched.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

authV1.route(`/signup`).post(async (req, res) => {
  try {
    const user = req.body;
    const userEmail = user.email;
    const isUserExists = await User.exists({
      "personalDetails.email": userEmail,
      "personalDetails.handleName": user.handleName,
    });
    if (isUserExists) {
      res.status(409).json({
        success: false,
        message: "User already exists...",
      });
    } else {
      const NewUser = new User({
        personalDetails: {
          ...user,
          password: sign(
            { password: user.password },
            process.env.USER_PWD_SECRET
          ),
        },
      });
      const savedUser = await NewUser.save();
      const encodedToken = sign(
        { _id: savedUser._id, email: savedUser.email },
        process.env.USER_PWD_SECRET,
        { expiresIn: "24h" }
      );
      if (sendVerificationEmail(userEmail, encodedToken)) {
        res.status(201).json({
          success: true,
          savedUser,
          encodedToken,
          message: "User created succefully. Please verify your email.",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Unable to send verification email.",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user.",
      errorMessage: err.message,
    });
  }
});

authV1.route("/verify-handle").post(async (req, res) => {
  try {
    const { handleName } = req.body;
    const isDuplicateHandle = await User.exists({
      personalDetails: { handleName },
    });
    if (isDuplicateHandle) {
      res.status(409).json({
        success: false,
        message: "Handle name already exists.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Handle name is available.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

authV1.route("/verify-email/:token").get(async (req, res) => {
  try {
    const { token } = req.params;
    const { _id } = unsign(token, process.env.USER_PWD_SECRET);
    const foundUser = await User.find({ _id: _id });
    if (foundUser[0]) {
      await User.updateOne(
        { _id: _id },
        {
          $set: {
            isUserVerified: true,
          },
        }
      );
      const updatedUser = await User.find({ _id: _id });
      res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        verifiedUser: updatedUser[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

module.exports = { authV1 };
