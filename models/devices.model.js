import mongoose from 'mongoose'
const Schema = mongoose.Schema

const DevicesSchema = new Schema({
  token: {
    type: String,
    required: true
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

export default mongoose.model('Devices', DevicesSchema)