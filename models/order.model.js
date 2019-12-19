import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema({
  items: [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food'
      },
      qty: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  delivery_address: {
    type: String,
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  status: {
    type: String,
    enum: ['waitting','confirmed','rejected','done', 'canceled'],
    default: 'waitting',
    required: true
  },
  payment_method: {
    type: String,
    enum: ['COD'],
    default: 'COD',
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  shipping_fee: {
    type: Number,
    required: true
  },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)