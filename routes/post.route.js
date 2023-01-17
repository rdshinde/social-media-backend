const express = require("express");
const { User } = require("../schemas/user.schema");

const { verifyUser } = require("../middlewares/verifyUser.middleware");

const { v4: uuid } = require("uuid");

const { Post } = require("../schemas/post.schema");

const { Notification } = require("../schemas/notification.schema");

const postsV1 = express.Router();

postsV1.route("/").get(async (req, res) => {
  try {
    const foundPosts = await Post.find();
    if (!foundPosts) {
      res.status(404).json({
        success: false,
        message: "No posts found.",
      });
    }
    res.json({ success: true, allPosts: foundPosts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});
postsV1.route("/:id").post(verifyUser, async (req, res) => {
  try {
    const id = req.userId;
    const foundUser = await User.findOne({
      "personalDetails.handleName": id,
    });
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const { post } = req.body;
    const newPost = new Post({
      postAuthor: foundUser._id,
      postContent: {
        textContent: post.textContent,
        mediaContent: {
          mediaUrl: post.mediaContentUrl,
        },
      },
      postDate: Date.now(),
    });
    const savedPost = await newPost.save();
    foundUser.postsDetails.posts.push(savedPost._id);
    foundUser.postsDetails.postsCount = foundUser.postsDetails.posts.length;
    if (!savedPost) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
    const newNotification = new Notification({
      notificationContent: {
        textContent: `${foundUser.personalDetails.handleName} has posted a new post.`,
        mediaContent: {
          mediaUrl: foundUser.personalDetails.profilePic.picUrl,
        },
      },
      postId: savedPost._id,
      userId: foundUser._id,
      notificationType: "post",
      notificationAuther: foundUser._id,
      notificationDate: Date.now(),
    });
    const savedNotification = await newNotification.save();
    foundUser.notificationsDetails.notifications.push(savedNotification._id);
    if (!savedNotification) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
    const savedUser = await foundUser.save();
    res.json({ success: true, newPost: savedPost, updatedUser: savedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});
postsV1.route("/:postId/:id").post(verifyUser, async (req, res) => {
  try {
    const id = req.userId;
    const postId = req.params.postId;

    const { post } = req.body;
    const foundPost = await Post.findOne({
      _id: postId,
    });
    if (!foundPost) {
      res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    foundPost.postContent.textContent = post.textContent;
    foundPost.postContent.isContentEdited = true;

    const savedPost = await foundPost.save();

    if (!savedPost) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
    const foundUser = await User.findOne({
      "personalDetails.handleName": id,
    }).populate("postsDetails.posts");
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.json({ success: true, updatedPost: savedPost, updatedUser: foundUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

module.exports = { postsV1 };
