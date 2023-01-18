const express = require("express");
const { User } = require("../schemas/user.schema");

const { verifyUser } = require("../middlewares/verifyUser.middleware");

const { v4: uuid } = require("uuid");

const { Post } = require("../schemas/post.schema");

const { Notification } = require("../schemas/notification.schema");

const postsV1 = express.Router();

postsV1.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find({});
    res.status(200).json({
      success: true,
      allPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});
postsV1
  .route("/:id")
  .get(verifyUser, async (req, res) => {
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
      const foundPosts = await Post.find({
        postAuthor: foundUser._id,
      });
      res.status(200).json({
        success: true,
        userPosts: foundPosts,
      });
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
          textContent: post.text,
          mediaContent: {
            mediaUrl: post.mediaUrl,
          },
        },
        postCreatedAt: new Date(),
      });
      const savedPost = await newPost.save();
      const newNotification = new Notification({
        notificationAuthor: foundUser._id,
        notificationType: "post",
        notificationDate: new Date(),
        postId: savedPost._id,
        notificationReceiver: foundUser._id,
        notificationContent: {
          textContent: "You just added a new post.",
          mediaContent: {
            mediaUrl:
              post?.mediaUrl ||
              foundUser.personalDetails?.profilePic?.picUrl ||
              "",
          },
        },
      });
      const savedNotification = await newNotification.save();
      foundUser.connections?.followers?.users?.forEach(async (follower) => {
        const newNotification = new Notification({
          notificationAuthor: foundUser._id,
          notificationType: "post",
          notificationCreatedAt: new Date(),
          postId: savedPost._id,
          notificationReceiver: follower,
          notificationContent: {
            textContent: `${foundUser.personalDetails.firstName} ${foundUser.personalDetails.lastName} just added a new post.`,
            mediaContent: {
              mediaUrl:
                post?.mediaUrl ||
                foundUser.personalDetails?.profilePic?.picUrl ||
                "",
            },
          },
        });
        await newNotification.save();
      });
      res.status(200).json({
        success: true,
        newPost: savedPost,
        notification: savedNotification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.....",
        error: error.message,
      });
    }
  });

postsV1.route("/:id/:postId").delete(verifyUser, async (req, res) => {
  try {
    const id = req.userId;
    const postId = req.params.postId;
    const foundUser = await User.findOne({
      "personalDetails.handleName": id,
    });
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const foundPost = await Post.findOne({
      _id: postId,
    });
    if (!foundPost) {
      res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (foundPost.postAuthor._id.toString() !== foundUser._id.toString()) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }
    await Post.deleteOne({
      _id: postId,
    });
    const updatedUser = await User.findOne({
      "personalDetails.handleName": id,
    }).populate("postsDetails.posts");
    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
      updatedUser: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

module.exports = { postsV1 };
