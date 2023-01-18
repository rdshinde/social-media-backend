const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  notificationType: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  notificationContent: {
    textContent: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      maxlength: 100,
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
    required: false,
  },
  notificationReceiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notificationAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notificationCreatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

notificationSchema.pre(["find", "findOne"], async function (next) {
  const notification = this;
  notification.populate("notificationReceiver");
  notification.populate("notificationAuthor");
  notification.populate("postId");
  next();
});

notificationSchema.virtual("newFollowerHandleName").get(function () {
  if (this.notificationType === "newFollower") {
    return this.notificationAuthor.handleName;
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
