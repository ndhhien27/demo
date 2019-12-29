import Notification from '../../models/notification.model';
import User from '../../models/user.model';
import Restaurant from '../../models/restaurant.model';
import Order from '../../models/order.model';
import dateToString from '../../helpers/date';

export default {
  Query: {
    notificationByUser: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User do not exist');
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 })
        return notifications.map(item => {
          return {
            ...item._doc,
            _id: item._id,
            createdAt: item._doc.createdAt
          };
        });
      }
      catch (error) {
        throw error
      }
    },
    notificationByRest: async (_, { restId }) => {
      try {
        const restaurant = await Restaurant.findById(restId);
        if (!restaurant) throw new Error('Restaurant do not exist');
        const notifications = await Notification.find({ restaurant: restId });
        return notifications.map(item => {
          return {
            ...item._doc,
            _id: item.id
          };
        });
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    markIsRead: async (_, { notificationId }) => {
      console.log(notificationId)
      try {
        const notification = await Notification
          .findByIdAndUpdate(notificationId, { $set: { isRead: true } }, { new: true });
        return {
          ...notification._doc,
          _id: notification.id
        }
      } catch (error) {
        throw error
      }
    },
    deleteNotification: async (_, { notificationId }) => {
      try {
        const notification = await Notification
          .findByIdAndDelete(notificationId)
        return notificationId
      } catch (error) {
        throw error
      }
    },
  },
  Notification: {
    order: async ({order}) => {
      try {
        return await Order.findById(order);
      } catch (error) {
        throw error
      }
    }
  }
}