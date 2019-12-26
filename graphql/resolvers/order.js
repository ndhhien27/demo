import Order from '../../models/order.model'
import User from '../../models/user.model'
import Food from '../../models/food.model'
import Restaurant from '../../models/restaurant.model'
import Devices from '../../models/devices.model'
import NotificationService from '../service/NotificationService'
import Notification from '../../models/notification.model'
import RestaurantDevice from '../../models/restaurantDevice.model'
import ResNotificationService from '../service/ResNotificationService'

export default {
  Query: {
    orders: async (parent, args, { isAuth }, info) => {
      if (!isAuth) throw new Error('Unauthenticated')
      try {
        const orders = await Order.find()
          .populate('items.food')
          .populate('user')
          .populate('restaurant')
          .exec()
        return orders.map(item => ({
          ...item._doc,
          _id: item.id
        }))
      } catch (error) {
        throw error
      }
    },
    ordersOfRestaurant: async (_, { restaurantId }) => {
      try {
        const orders = await Order.find({ restaurant: restaurantId }).exec()
        return orders.map(item => ({
          ...item._doc,
          _id: item.id
        }))
      } catch (error) {
        throw error
      }
    },
    ordersOfUser: async (_, { userId }) => {
      try {
        const orders = await Order.find({ user: userId }).exec()
        return orders.map(item => ({
          ...item._doc,
          _id: item.id
        }))
      } catch (error) {
        throw error
      }
    },
    orderById: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId)
        return {
          ...order._doc,
          _id: order.id
        }
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    createOrder: async (_, { orderInput }) => {
      try {
        const newOrder = new Order({
          restaurant: orderInput.restaurant,
          user: orderInput.user,
          delivery_address: orderInput.delivery_address,
          items: orderInput.items,
          distance: orderInput.distance,
          shipping_fee: orderInput.shipping_fee
        })
        await newOrder.save()
        const userOfOrder = await User.findById(newOrder.user);
        if (!userOfOrder) throw new Error('User not exist');
        userOfOrder.orders.push(newOrder);
        await userOfOrder.save()
        const foodArr = orderInput.items.map(item => {
          return item.food
        })
        await Food.updateMany({ _id: { $in: foodArr } }, { $inc: { total_order: 1 } })
        //Send notice
        const restaurant = await Restaurant.findById(orderInput.restaurant)
        const devices = await RestaurantDevice.find({ user: restaurant._doc.merchant, restaurant: orderInput.restaurant })
        for (const device of devices) {
          let { token } = device
          NotificationService.sendMerchantNotification(
            {
              title: 'New order',
              message: 'Check you new order, A new order has come',
              orderId: newOrder._id
            },
            token,
            res => {
            },
            err => {
              throw err
            }
          )
        }
        return {
          ...newOrder._doc,
          _id: newOrder.id,
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          distance: newOrder.distance,
          shipping_fee: newOrder.shipping_fee
        }
      } catch (error) {
        throw error
      }
    },
    updateOrder: async (_, { orderId, status }) => {
      try {
        const order = await Order.findByIdAndUpdate(orderId,
          { $set: { status } },
          { new: true })
        const restaurant = await Restaurant.findById(order.restaurant)
        if (status === 'confirmed' || status === 'rejected') { 
          console.log('sadasdasd')
          const newNotification = new Notification({
            title: `Order has bean ${status}`,
            order,
            user: order.user,
            store: order.restaurant,
            message: `Your order ${orderId} from ${restaurant._doc.name} has been ${status}`
          })
          await newNotification.save()
          const devices = await Devices.find({ user: order.user })
          for (const device of devices) {
            let { token } = device
            NotificationService.sendNotification(
              { ...newNotification._doc, orderId },
              token,
              res => {
              },
              err => {
                throw err
              }
            )
          }
        }
        if (status === 'canceled') {
          const devices = await RestaurantDevice.find({ user: restaurant._doc.merchant, restaurant: restaurant._id })
          const buyer = await User.findById(order.user)
          console.log(buyer._id)
          for (const device of devices) {
            let { token } = device
            ResNotificationService.sendMerchantNotification(
              {
                title: 'Order has been canceled',
                message: `Order ${orderId} has been canceled by ${buyer._id} !`,
                orderId: orderId
              },
              token,
              res => {
              },
              err => {
                throw err
              }
            )
          }
        }

        return {
          ...order._doc,
          _id: order.id
        }
      } catch (error) {
        throw error
      }
    }
  },
  Item: {
    food: async ({ food }) => {
      return await Food.findById(food);
    }
  },
  Order: {
    restaurant: async ({ restaurant }) => {
      return await Restaurant.findById(restaurant).exec()
    },
    user: async ({ user }) => {
      return await User.findById(user);
    }
  }
}