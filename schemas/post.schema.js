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
postSchema.pre("find", function () {
  this.postLikes?.populate("likes");
  this.postComments?.populate("comments");
  this.postAuthor?.populate("postAuthor");
  this.postId?.populate("postId");
});

module.exports = { postSchema };
const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
