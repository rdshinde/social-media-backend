const express = require("express");
const sign = require("jwt-encode");
const unsign = require("jwt-decode");
const { verifyUser } = require("../middlewares/verifyUser.middleware");
const { v4: uuid } = require("uuid");
const profileV1 = express.Router();

const { User } = require("../schemas/user.schema");

profileV1.route("/").get(async (req, res) => {
  try {
    const foundUser = await User.find();
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.json({ success: true, foundUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

profileV1
  .route("/:id")
  .get(verifyUser, async (req, res) => {
    try {
      const { id } = req.params;
      const foundUser = await User.find({
        "personalDetails.handleName": id,
      });
      if (!foundUser) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      res.json({ success: true, foundUser });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  })
  .post(verifyUser, async (req, res) => {
    try {
      const { id } = req.params;
      const foundUser = await User.findById(req.userId);
      if (!foundUser) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      // await User.updateOne(
      //   { "personalDetails.handleName": id },
      //   { $set: { personalDetails: req.body } }
      // );
      console.log(foundUser.personalDetails);
      foundUser.personalDetails = { ...foundUser.personalDetails, ...req.body };
      const updatedUser = await foundUser.save();
      res.json({ success: true, updatedUser });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error...",
        error: error.message,
      });
    }
  })
  .delete(verifyUser, async (req, res) => {
    try {
      const { id } = req.params;
      const foundUser = await User.find({
        "personalDetails.handleName": id,
      });
      if (!foundUser) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      const deletedUser = await User.deleteOne({
        "personalDetails.handleName": id,
      });
      res.json({ success: true, deletedUser });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  });

module.exports = { profileV1 };
