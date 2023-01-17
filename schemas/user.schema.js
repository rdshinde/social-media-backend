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
      // validate: {
      //   validator: function (value) {
      //     return this.match.test(value);
      //   },
      //   message: "Invalid email format.",
      // },
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
});

userSchema.pre(["find", "findOne", "deleteOne"], function () {
  if (this.connections) {
    this.populate("connections.followers.users");
    this.populate("connections.following.users");
  }
  this.populate("postsDetails.posts");
  this.populate("likesDetails.likes");
  this.populate("commentsDetails.comments");
  this.populate("notificationsDetails.notifications");
  this.populate("bookmarksDetails.bookmarks");
});

module.exports = { userSchema };
const User = mongoose.model("User", userSchema);
module.exports = { User };
