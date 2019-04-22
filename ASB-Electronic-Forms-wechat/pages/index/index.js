const app = getApp()

Page({
  data: { 
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    buyerName: '',
    arrayClass: ['9(1)', '9(2)', '9(3)', '9(4)', '9(5)', '9(6)', '9(7)', '9(8)', '9(8)', '9(9)', '9(10)', '9(11)', '10(1)', '10(2)', '10(3)', '10(4)', '10(5)', '10(6)', '10(7)', '10(8)', '10(9)', '10(10)', '10(11)'],
    indexClass: '0',
    requestMessage: '',
    quanA: 0,
    quanB: 0,
    quanC: 0,
    //price
    priceA: 10,
    priceB: 10,
    priceC: 10,
    cost: 0
  },

  //input 
  bindNameInput: function (e) {
    this.setData({
      buyerName: e.detail.value
    })
  },
  bindPickerClassChange: function(e) {
    this.setData({
      indexClass:e.detail.value
    })
  },
  bindInputBoxQuantityA: function(e) {
    var input = parseInt(e.detail.value);
    this.setData({
      quanA: input
    })
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },
  bindInputBoxQuantityB: function (e) {
    var input = parseInt(e.detail.value);
    this.setData({
      quanB: input
    })
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },
  bindInputBoxQuantityC: function (e) {
    var input = parseInt(e.detail.value);
    this.setData({
      quanC: input
    })
    var ccost = changeCost(this.data);
    this.setData({
      cost: ccost
    })
  },

  onSubmit: function () {
    if (this.data.buyerName == '') {//if buyer's name is not blank
      this.setData({
        buyerName: userInfo.nickName
      })
    } else {
      // navigate to submitPage and send buyerName, class, and cost
      const murl = 'http://localhost:5000/input';
      const mbody = JSON.stringify({ "BuyerName": this.data.inputName, "BuyerClass": this.data.arrayClass[this.data.indexClass], "Cost": this.data.cost });
      wx.request({
        url: murl,
        method: 'POST',
        data: mbody,
        headers: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          this.setData({requestMessage: res.data });
        }.bind(this),
        fail: function(){
          wx.navigateTo({
            url: '/pages/submitFailPage/submitFailPage?',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          });
        }
      });
      if (requestMessage = 'success') {
        wx.navigateTo({
          url: '/pages/submitPage/submitPage?',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      } else {
        wx.navigateTo({
          url: '/pages/submitFailPage/submitFailPage?',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      }
    }
  },
})

function changeCost(data){ //Calculates the cost
  var qa = data.quanA;
  var qb = data.quanB;
  var qc = data.quanC;
  var ca = data.priceA;
  var cb = data.priceB;
  var cc = data.priceC;
  var ccost = (qa * ca + qb * cb + qc * cc);
  return ccost;
}