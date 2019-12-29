import axios from 'axios'
import { FCM_KEY } from './FCM_KEY'
axios.defaults.headers.common['Authorization'] = FCM_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json'

const sendNotification = (content, fcmToken, resCb, errCb) => {
  const { message, title, orderId, createdAt, isRead, _id } = content
  const data = {
    to: fcmToken,
    notification: {
      "body": message,
      title,
      "content_available": true,
      "priority": "high"
    },
    data: {
      title,
      message,
      order: {
        _id: orderId
      },
      isRead,
      _id,
      createdAt,
      "content_available": true,
      "priority": "high"
    }
  }
  return axios({
    url: 'https://fcm.googleapis.com/fcm/send',
    data,
    method: 'post'
  }).then(resCb).catch(errCb)
}

const sendMerchantNotification = (content, fcmToken, resCb, errCb) => {
  const { message, title, orderId } = content
  const data = {
    to: fcmToken,
    notification: {
      "body": message,
      title,
      "content_available": true,
      "priority": "high"
    },
    data: {
      order: {
        _id: orderId
      },
      "content_available": true,
      "priority": "high"
    }
  }
  return axios({
    url: 'https://fcm.googleapis.com/fcm/send',
    data,
    method: 'post'
  }).then(resCb).catch(errCb)
}

export default {
  sendNotification, sendMerchantNotification
}