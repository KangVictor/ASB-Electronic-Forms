// gets the item info (item names array, item prices array, number of items) and return them
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection("itemInfo").doc('itemInfoList').get();
}