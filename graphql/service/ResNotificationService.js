import axios from 'axios'
import { RES_FCM_KEY } from './RES_FCM_KEY'
// axios.defaults.headers.common['Authorization'] = RES_FCM_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json'
const headers = {
  Authorization: RES_FCM_KEY,
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
    method: 'post',
    headers
  }).then(resCb).catch(errCb)
}

export default {
    sendMerchantNotification
}