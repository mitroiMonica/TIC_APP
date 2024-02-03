import AppError from "../utils/appError.js";
import db from "./../database/firestore.js";

const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      throw new AppError("Notification id is required!", 400);
    }
    const userRef = db.collection("Users").doc(req.userId);
    const notificationRef = userRef
      .collection("Notifications")
      .doc(notificationId);
    const notification = await notificationRef.get();
    if (!notification.exists) {
      throw new AppError("Invalid notification!");
    }
    await notificationRef.update({
      read: true,
    });
    res.status(201).json({
      status: "success",
      message: "Notification marked as read",
    });
  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      throw new AppError("Notification id is required!", 400);
    }
    const userRef = db.collection("Users").doc(req.userId);
    const notificationRef = userRef
      .collection("Notifications")
      .doc(notificationId);
    const notification = await notificationRef.get();
    if (!notification.exists) {
      throw new AppError("Invalid notification!");
    }
    await notificationRef.delete();
    res.status(201).json({
      status: "success",
      message: "Notification successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

export { markAsRead, deleteNotification };
