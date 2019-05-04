// (function (exports, require, module, __filename, __dirname) { 
  const cloud = require('wx-server-sdk')

  cloud.init()

  const db = cloud.database();

  // 云函数入口函数
  exports.main = async (event, context) => {
    console.log(event);
    db.collection("orders").add({
      data: {
        buyerName: event.buyerName,
        buyerClass: event.buyerClass,
        buyerGrade: event.buyerGrade,
        buyerQuan: event.buyerQuan,
        buyerCost: event.buyerCost,
        confirmed: false
      },
      success(res) {
        return "success";
      },
      fail(res) {
        return "fail";
      }
    })
  }
// });