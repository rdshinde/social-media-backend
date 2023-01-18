const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  isUserVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
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
      required: [true, "Email is required"],
      trim: true,
      match: /.+\@.+\..+/, // regex for email
      minlength: 3,
      maxlength: 50,
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
      match:
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      validate: {
        validator: function (value) {
          return this.match.test(value);
        },
        message: "Invalid website format",
      },
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
    },
    following: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  postsDetails: {
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        unique: true,
      },
    ],
  },
  likesDetails: {
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  commentsDetails: {
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  notificationsDetails: {
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  bookmarksDetails: {
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
});

userSchema.pre(["find", "findOne", "deleteOne"], function () {
  if (this.connections) {
    this.populate("connections.followers.users");
    this.populate("connections.following.users");
  }
  this.populate("postsDetails.posts");
  this.populate("likesDetails.likedPosts");
  this.populate("commentsDetails.comments");
  this.populate("notificationsDetails.notifications");
  this.populate("bookmarksDetails.bookmarks");
});

userSchema.virtual("followersCount").get(function () {
  return this.connections.followers.users.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.connections.following.users.length;
});

userSchema.virtual("postsCount").get(function () {
  return this.postsDetails.posts.length;
});

userSchema.virtual("likedPostCount").get(function () {
  return this.likesDetails.likedPosts.length;
});

userSchema.virtual("commentsCount").get(function () {
  return this.commentsDetails.comments.length;
});

userSchema.virtual("notificationsCount").get(function () {
  return this.notificationsDetails.notifications.length;
});

userSchema.virtual("bookmarksCount").get(function () {
  return this.bookmarksDetails.bookmarks.length;
});

module.exports = { userSchema };
const User = mongoose.model("User", userSchema);
module.exports = { User };
