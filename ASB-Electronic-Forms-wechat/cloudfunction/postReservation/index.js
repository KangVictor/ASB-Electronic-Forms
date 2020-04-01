const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const orders = await db.collection("reservations").where({}).get({});
  
  // use randomId for the order
  const randomId = createRandomId(orders)

  const lowerCasedName = (event.studentName).toLowerCase();
  
  await db.collection("reservations").add({
    data: {
      _id: randomId,
      studentName: lowerCasedName,
      studentClass: event.studentClass,
      studentGrade: event.studentGrade,
      studentTotal: event.studentTotal,
      recipients: event.recipientList,
      confirmed: false
    },
    fail(res) {
      return "fail";
    }
  })

  return randomId;
}

function createRandomId(orders) {
  var randomId = 0; // random number that is going to be the code of the order
  var isAvailableId = false;
  while (isAvailableId == false) {
    randomId = Math.floor((Math.random() * 8999) + 1000);
    var check = true;
    for (var i = 0; i < orders.length; i++) {
      if (ordersId[i]['_id'] == randomId) {
        check = false;
      }
    }
    isAvailableId = check;
  }
  return randomId;
}