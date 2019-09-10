// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const reservationId = event.reservationId;

  var getConfirmed = await db.collection('reservations').where({ _id: reservationId }).get("confirmed")

  if (getconfirmed) {
    getconfirmed = false
  } else {
    getconfirmed = true
  }
  await db.collection('reservations').where({
    _id: reservationId
  })
    .update({
      data: {
        confirmed: getconfirmed
      },
    })
  return await db.collection('reservations').where({}).get();
} 