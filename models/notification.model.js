import mongoose from 'mongoose'
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default mongoose.model('Notification', NotificationSchema)