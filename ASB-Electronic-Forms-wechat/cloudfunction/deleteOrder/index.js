const cloud = require('wx-server-sdk')
const db = cloud.database()

exports.main = async (event, context) => {
  const dataId = event.id;
  try {
    return await db.collection('todos').where({
      done: true
    }).remove()
  } catch (e) {
    console.error(e)
  }
}