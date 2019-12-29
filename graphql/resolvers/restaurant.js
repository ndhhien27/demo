import Restaurant from '../../models/restaurant.model'
import User from '../../models/user.model'
import DishType from '../../models/dishType.model'
import Food from '../../models/food.model'
import { mergeArr } from '../../helpers/array'
import distanceHelper from '../../helpers/calculateDistance'
import RestaurantDevice from '../../models/restaurantDevice.model'

export default {
  Query: {
    restaurants: async () => {
      try {
        const restaurant = await Restaurant.find({}).exec();
        return restaurant.map(item => ({
          ...item._doc,
          _id: item.id,
        }))
      } catch (error) {
        throw error
      }
    },
    restaurantNearby: async (_, { lat, long }) => {
      try {
        const restaurant = await Restaurant.find({}).exec();
        let newStoreList = restaurant.map(item => {
          let distance = distanceHelper.getDistanceFromLatLonInKm(lat, long, item.location.lat, item.location.long)
          return {
            ...item,
            distance: distance
          }
        })
        const compare = (a, b) => {
          if (a.distance < b.distance) {
            return -1
          }
          if (a.distance > b.distance) {
            return 1
          }
          return 0
        }
        newStoreList.sort(compare)
        return newStoreList.map(item => ({
          ...item._doc,
          _id: item._doc._id,
          distance: item.distance
        }))
      } catch (error) {
        throw error
      }
    },
    restaurantByMerchant: async (_, { merchantId }) => {
      try {
        const restaurants = await Restaurant.find({ merchant: merchantId }).exec()
        return restaurants.map(item => ({
          ...item._doc,
          _id: item.id,
        }))
      } catch (error) {
        throw error
      }
    },
    restaurantById: async (_, { restaurantId }) => {
      try {
        const restaurant = await Restaurant
          .findById(restaurantId)
          .populate('menu_info.foods')
        return {
          ...restaurant._doc,
          _id: restaurant.id
        }
      } catch (error) {
        throw error
      }
    },
    searchRestaurant: async (_, { query, lat, long }) => {
      try {
        const restaurants = await Restaurant.aggregate([
          { $match: { $text: { $search: query } } },
          { $sort: { score: { $meta: "textScore" } } },
        ]);
        const food = await Food.aggregate([
          {
            $match: { $text: { $search: query } }
          },
          {
            $lookup:
            {
              from: "restaurants",
              localField: "restaurant",
              foreignField: "_id",
              as: "restaurants"
            }
          },
          { $addFields: { score: { $meta: "textScore" } } },
          {
            $group:
            {
              _id: "$restaurants",
              itemsSold: { $addToSet: "$_id" },
              avgScore: { $avg: "$score" }
            }
          },
          { $sort: { avgScore: -1 } },
        ]);
        const searchByFood = food.map(item => {
          return {
            ...item._id['0'],
            score: item.avgScore
          }
        });
        const dishType = await DishType.aggregate([
          {
            $match: { $text: { $search: query } }
          },
          {
            $lookup:
            {
              from: "restaurants",
              localField: "restaurant",
              foreignField: "_id",
              as: "restaurants"
            }
          },
          { $addFields: { score: { $meta: "textScore" } } },
          {
            $group:
            {
              _id: "$restaurants",
              itemsSold: { $addToSet: "$_id" },
              avgScore: { $avg: "$score" }
            }
          },
          { $sort: { avgScore: -1 } },
        ]);
        const searchByDishType = dishType.map(item => {
          return {
            ...item._id['0'],
            score: item.avgScore
          }
        });
        const mergedArr = mergeArr(restaurants, searchByFood);
        const result2 = mergeArr(mergedArr, searchByDishType);
        let result3 = result2.map(item => {
          let distance = distanceHelper.getDistanceFromLatLonInKm(lat, long, item.location.lat, item.location.long)
          return {
            ...item,
            distance: distance
          }
        })
        return result3.map(item => {
          return {
            ...item,
          }
        })
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    createRestaurant: async (_, { restaurantInput }) => {
      try {
        const newRestaurant = new Restaurant({
          ...restaurantInput
        })
        await User.findOneAndUpdate(
          { _id: restaurantInput.merchant },
          { $push: { created_restaurants: newRestaurant } },
        )
        await newRestaurant.save();

        return {
          ...newRestaurant._doc,
          _id: newRestaurant.id
        }
      } catch (error) {
        throw error
      }
    },
    updateRestaurantDevice: async (_, { restaurantDeviceInput }) => {
      try {
        const res =  await RestaurantDevice.findOneAndUpdate(
          { deviceId: restaurantDeviceInput.deviceId },
          { user: restaurantDeviceInput.user, token: restaurantDeviceInput.token, restaurant: restaurantDeviceInput.restaurant },
          { new: true, upsert: true }
        )
        return {
          restaurant: restaurantDeviceInput.restaurant,
          user: restaurantDeviceInput.user
        }
      } catch (error) {
        throw error
      }
    },
  },
  Restaurant: {
    menu_info: async ({ _id }) => {
      return await DishType.find({ restaurant: _id });
    }
  }
}