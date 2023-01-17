const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  postContent: {
    textContent: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
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
  },
  postComments: {
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    required: false,
  },
  postLikes: {
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: false,
  },
  postDate: {
    type: Date,
    required: true,
  },
});

postSchema.pre(["find", "findOne"], function () {
  this.populate("postLikes.likes");
  this.populate("postComments.comments");
  this.populate("postAuthor");
});

module.exports = { postSchema };
const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
