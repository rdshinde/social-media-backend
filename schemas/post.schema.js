const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Post",
  },
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
  timestamps: true,
  collection: "posts",
});

module.exports = { postSchema };
module.exports = mongoose.model("Post", postSchema);
