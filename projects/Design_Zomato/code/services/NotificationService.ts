/**
 * NotificationService — lean 3rd-party notification wrapper.
 *
 * Teaching note:
 *   We intentionally do NOT build SMS / Push / Email Strategy trees here.
 *   One service is enough: after a successful order, notify the user.
 *   The vendor (FCM, Twilio, SES…) owns channel details.
 */
import { Order } from "../models/Order";
import { User } from "../models/User";

export class NotificationService {
  notify(user: User, order: Order): void {
    console.log(
      `[Notification] Hey ${user.getName()}! Order #${order.getId()} (${order.getType()}) placed successfully. Total ₹${order.getTotal()}.`,
    );
    // Imagine: fcm.send({ userId: user.getId(), title: "Order placed", ... })
  }
}
