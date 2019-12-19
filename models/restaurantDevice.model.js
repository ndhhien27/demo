import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RestaurantDevice = new Schema({
  token: {
    type: String,
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  deviceId: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default mongoose.model('RestaurantDevice', RestaurantDevice)