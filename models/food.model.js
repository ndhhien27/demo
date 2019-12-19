const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  is_available: {
    type: Boolean,
    default: true
  },
  price: Number,
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  dish_type: {
    type: Schema.Types.ObjectId,
    ref: 'DishType'
  }
}, { timestamps: true })

FoodSchema.index({
  name:'text'
})

module.exports = mongoose.model('Food', FoodSchema)