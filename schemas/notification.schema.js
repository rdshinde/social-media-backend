const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  notificationId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Notification",
  },
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
  timestamps: true,
  collection: "notifications",
});

module.exports = { notificationSchema };

module.exports = mongoose.model("Notification", notificationSchema);
