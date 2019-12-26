import axios from 'axios'
import { FCM_KEY } from './FCM_KEY'
// import { RES_FCM_KEY } from './RES_FCM_KEY'
// axios.defaults.headers.common['Authorization'] = 'key=AAAAwTBzZOU:APA91bGRxurz6QZ8FTUOo0xhA-RjiLqTbD9eixx56NAPaVg5RsKGF4Coa6K6NPOMwZWC15hhezvCElNxv_Di5cPWsxyJBKf6_iesMrczRkDubaRxebNlDXWU-BWyj6sdJWKfPkjHV73O';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const headers = {
  Authorization: FCM_KEY,
}

const sendNotification = (content, fcmToken, resCb, errCb) => {
  const { message, title, orderId, createdAt, isRead, _id } = content
  console.log(content)
  const data = {
    to: 'chYlfDgN1DE:APA91bGjNE9hWEj9SivDxKfJH-spApvjlNyfhISs9kga3MEVGmbmhBy-7e6sBg8esfRXXffttFfkArTzIZz8niWIKG3uEBSU7fYsg1ckg5sWishPfpsoAh_ZazPPf4kp-9hdfGj9-wWO',
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
    method: 'post',
    headers
  }).then(resCb).catch(errCb)
}


export default {
  sendNotification
}