const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  postContent: {
    textContent: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 10000,
    },
    mediaContent: {
      mediaUrl: {
        type: String,
        required: false,
        trim: true,
      },
    },

    isContentEdited: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  postAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postLikes: {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  postComments: {
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  postCreatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

postSchema.virtual("postLikesCount").get(function () {
  return this.postLikes.users.length;
});

postSchema.virtual("postCommentsCount").get(function () {
  return this.postComments.comments.length;
});

postSchema.pre("save", function (next) {
  const post = this;
  if (post.isModified("postContent")) {
    post.postContent.isContentEdited = true;
  }
  next();
});

postSchema.pre(["find", "findOne"], function (next) {
  this.populate("postAuthor");
  this.populate("postLikes.users");
  this.populate("postComments.comments");
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
