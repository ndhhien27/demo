import mongoose from 'mongoose';
import { tokenize } from '@apollo/protobufjs';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  created_restaurants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  ],
  location: [
    {
      address: {
        type: String,
        required: true
      },
      lat: {
        type: Number,
        required: true
      },
      long: {
        type: Number,
        required: true
      },
    }
  ],
  favorite: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  ],
  authToken: {
    type: String,
    required: true
  },
  countNotification: {
    type: Number,
    default: 0
  },
  isMerchant: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('User', userSchema);