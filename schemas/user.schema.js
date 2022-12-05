const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  personalDetails: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    handleName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /.+\@.+\..+/, // regex for email
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    profilePic: {
      picUrl: {
        type: String,
        required: false,
        trim: true,
      },
      picAlt: {
        type: String,
        required: false,
        trim: true,
      },
    },
    profileBackground: {
      bgUrl: {
        type: String,
        required: false,
        trim: true,
      },
      bgAlt: {
        type: String,
        required: false,
        trim: true,
      },
    },
    bio: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    website: {
      type: String,
      required: false,
    },
    joinedOn: {
      type: Date,
      required: true,
      default: 0,
    },
  },
  connections: {
    followers: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      type: Number,
      required: true,
      default: 0,
    },
    following: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      type: Number,
      required: true,
      default: 0,
    },
  },
  postsDetails: {
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    postsCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  likesDetails: {
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likesCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  commentsDetails: {
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    commentsCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  notificationsDetails: {
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    notificationsCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  bookmarksDetails: {
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarksCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  // collection: "users",
});
userSchema.pre("find", function () {
  this.connections?.followers?.populate("users");
  this.connections?.following?.populate("users");
  this.postsDetails?.posts?.populate("posts");
  this.likesDetails?.likes?.populate("likes");
  this.commentsDetails?.comments?.populate("comments");
  this.notificationsDetails?.notifications?.populate("notifications");
  this.bookmarksDetails?.bookmarks?.populate("bookmarks");
});
module.exports = { userSchema };
const User = mongoose.model("User", userSchema);
module.exports = { User };
