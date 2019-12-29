import bcrypt from 'bcryptjs';
import User from '../../models/user.model';
import Restaurant from '../../models/restaurant.model'
import jwt from 'jsonwebtoken';
import LoginValidation from '../../validation/LoginValidation'
import SignUpValidation from '../../validation/SignUpValidation'
import Devices from '../../models/devices.model'

export default {
  Query: {
    users: async () => {
      try {
        let users = await User.find().exec();
        return users.map(user => ({
          ...user._doc,
          _id: user.id
        }))
      } catch (err) {
        console.log(err);
        throw err
      }
    },
    user: async (_, { userId }) => {
      try {
        let user = await User.findById(userId)
        return user._doc
      } catch (error) {
        
      }
    }
  },
  Mutation: {
    createUser: async (_, { userInput, isMerchant }) => {
      if(SignUpValidation({...userInput}).error) {
        let errMessage = SignUpValidation({...userInput}).error.message
        throw new Error(errMessage)
      }

      try {
        const userExist = await User.findOne({ email: userInput.email })
        if (userExist) throw new Error('User exists already')
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userInput.password, salt)
        const token = jwt.sign({ userId: userInput._id, email: userInput.email }, process.env.SECRET_KEY)
        const newUser = new User({
          ...userInput,
          password: hashedPassword,
          authToken: token,
          isMerchant: isMerchant
        });
        await newUser.save();
        return {
          ...newUser._doc,
          password: null,
          _id: newUser.id,
          authToken: token
        }
      } catch (error) {
        throw error
      }
    },
    login: async (_, { email, password, fcmToken, deviceId, merchantApp }) => {
      if(LoginValidation({email : email, password: password}).error) {
        let errMessage = LoginValidation({email : email, password: password}).error.message
        throw new Error(errMessage)
      }
      
      const user = await User.findOne({$and : [
        { email },
        { isMerchant: merchantApp }
      ]});
      if (!user) throw new Error("User does not exist");
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error("Wrong password");
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY)
      console.log(fcmToken, deviceId)
      if(fcmToken && deviceId) {
        await Devices.findOneAndUpdate(
          { deviceId },
          { user, token: fcmToken },
          { new: true, upsert: true }
        )
      }
      return {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        authToken: token,
        location: user.location,
        tokenExpiration: 1,
        email: user.email,
        countNotification: user.countNotification,
        isMerchant: user.isMerchant,
        phone: user.phone
      }
    },
    addLocation: async (_, { location } ) => {
      const user = await User.findById(location.userId);
      if (!user) throw new Error("User does not exist");
      if (location && location.address && location.lat && location.long) {
        user.location.forEach(element => {
          if(element.address === location.address) {
            throw new Error("Addres already existed !");
          }
        });
        let newLocation = {address: location.address, lat: location.lat, long:location.long}
        user.location.push(newLocation)
      }
      let updatedUser = await user.save() 
      return {
        _id: updatedUser.id,
        location: updatedUser._doc.location,
        email: updatedUser._doc.email
      }
    },
    updateUser: async (_, { userId, updateUserReq }) => {
      const updateUser = await User.findByIdAndUpdate(userId, { $set: {...updateUserReq} }, { new: true })
      return{
        ...updateUser._doc,
        _id: updateUser.id
      }
    }
  },
  User: {
    createdRestaurants: async ({ _id }) => {
      return await Restaurant.find({ merchant: _id })
    }
  }
}