import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  is_open: {
    type: Boolean,
    default: true
  },
  cuisines: [
    {
      type: String,
      required: true
    }
  ],
  name: {
    type: String,
    required: true,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    }
  },
  menu_info: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DishType'
    }
  ],
  rating: {
    avg: {
      type: Number,
      default: 0
    },
    total_review: {
      type: Number,
      default: 0
    }
  },
  countNotification: {
    type: Number,
    default: 0
  },
  img: {
    type: String,
    default: 'https://res.cloudinary.com/de5qf4lzo/image/upload/v1576662959/brooke-lark-nTZOILVZuOg-unsplash_jitrrn.jpg'
  }
}, { timestamps: true })

restaurantSchema.index({
  name: 'text'
});

export default mongoose.model('Restaurant', restaurantSchema)