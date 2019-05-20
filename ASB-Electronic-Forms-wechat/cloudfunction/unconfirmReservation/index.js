// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const orderId = event.orderId;
  console.log(orderId);
  await db.collection('reservations').where({
    _id: orderId
  })
  .update({
    data: {
      confirmed: false
    },
  })
  return await db.collection('reservations').where({}).get();
}