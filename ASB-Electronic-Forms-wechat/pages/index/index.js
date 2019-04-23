const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    buyerName: '',
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',
    requestMessage: '',

    quan: [0, 0, 0, 0, 0, 0, 0, 0],
    itemPrices: [],
    itemNames: [],
    itemNum: 0,
    cost: 0
  },

  onLoad() {
    // request to the server for price and quantities of the item
    const murl = 'http://localhost:5000/getitem';
    wx.request({
      url: murl,
      method: 'GET',
      success: function (res) {
        const getPrices = res.data['itemPrice'];
        const getNames = res.data['itemName'];
        const getNum = res.data['itemNum'];
        this.setData({
          itemNum: getNum,
          itemNames: getNames,
          itemPrices: getPrices
        })
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      }
    });
  },

  //input 
  bindNameInput: function (e) {
    this.setData({
      buyerName: e.detail.value
    })
  },
  bindPickerGradeChange: function (e) {
    this.setData({
      indexGrade: e.detail.value
    })
  },
  bindPickerClassChange: function (e) {
    this.setData({
      indexClass: e.detail.value
    })
  },
  bindInputBoxQuantityA: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[0] = input;
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },
  bindInputBoxQuantityB: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[1] = input;
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },
  bindInputBoxQuantityC: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[2] = input;
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },

  onSubmit: function () {
    if (this.data.buyerName == '') {//if buyer's name is not blank
      // should change to error message later on
      wx.navigateTo({
        url: '/pages/submitFailPage/submitFailPage?',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
    } else {
      // navigate to submitPage and send buyerName, class, and cost
      const murl = 'http://localhost:5000/create/order';
      const mbody = JSON.stringify({"BuyerName": this.data.buyerName, "BuyerGrade": this.data.arrayGrade[this.data.indexGrade], "BuyerClass": this.data.arrayClass[this.data.indexClass], "BuyerCost": this.data.cost });
      wx.request({
        url: murl,
        method: 'POST',
        data: mbody,
        headers: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log('in')
          this.data.requestMessage = res.data['message'];
          wx.navigateTo({
            url: '/pages/submitPage/submitPage?',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          });
        }.bind(this),
        fail: function () {
          wx.navigateTo({
            url: '/pages/submitFailPage/submitFailPage?',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          });
        }
      });
      // console.log(this.data.requestMessage);
      // if (this.data.requestMessage == 'success') {
      //   console.log("success");
      //   wx.navigateTo({
      //     url: '/pages/submitPage/submitPage?',
      //     success: function (res) { },
      //     fail: function (res) { },
      //     complete: function (res) { },
      //   });
      // } else {
      //   console.log("fail");
      //   wx.navigateTo({
      //     url: '/pages/submitFailPage/submitFailPage?',
      //     success: function (res) { },
      //     fail: function (res) { },
      //     complete: function (res) { },
      //   });
      // }
    }
  },
})

function changeCost(data) { // Calculates the cost
  var ccost = 0;
  for(var count = 0; count < data.itemNum; count++) {
    ccost += data.quan[count] * data.itemPrices[count]
  }
  return ccost;
}

function getQuantity(num) { // if no number, 0, if integer, parse it and return
  if (num == '' || Number.isInteger(num) == true) {
    num = 0;
  } else if (num < 0) {
    num = 0;
  }
  return parseInt(num);
}