import React from "react";
import { notification } from "antd";

export default function NotificationCustom() {
  return (
    <div>
      {notification.open({
        message: "Notification Title",
        description:
          "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      })}
    </div>
  );
}
