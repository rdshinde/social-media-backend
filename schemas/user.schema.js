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
      maxlength: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
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
      required: true,
    },
    joinedOn: {
      type: Date,
      required: true,
      default: Date.now(),
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
      default: this.followers.users.length,
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
      default: this.following.users.length,
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
      default: this.posts.length,
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
      default: this.likes.length,
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
      default: this.comments.length,
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
      default: this.notifications.length,
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
      default: this.bookmarks.length,
    },
  },
  timestamps: true,
  collection: "users",
});
module.exports = { userSchema };
module.exports = mongoose.model("User", userSchema);
