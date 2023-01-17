const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  notificationContent: {
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
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  notificationType: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },

  notificationAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  notificationDate: {
    type: Date,
    required: true,
  },
});

module.exports = { notificationSchema };

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
