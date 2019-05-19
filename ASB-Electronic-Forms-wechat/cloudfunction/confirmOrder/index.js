// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const orderId = event.orderId;
  console.log(orderId);
  var checkSuccess = false;
  await db.collection('orders').where({
    _id: orderId
    })
    .update({
      data: {
        confirmed: true
      },
      success(res) {
        console.log('in')
      },
  })
  return await db.collection('orders').where({}).get();
}