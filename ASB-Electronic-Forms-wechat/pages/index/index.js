//index.js
//获取应用实例
const app = getApp()

Page({
  data: { 
    motto: 'Hello World',
    submitMessage: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    focusSuccessMessage: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad:function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //input
  data: {
    focus: false,
    buyerName: '',
    arrayClass: ['9(1)', '9(2)', '9(3)', '9(4)', '9(5)', '9(6)', '9(7)', '9(8)', '9(8)', '9(9)', '9(10)', '9(11)'],
    indexClass: '0',
    quanA: 0,
    quanB: 0,
    quanC: 0,
    priceA: 10,
    priceB: 10,
    priceC: 10,
    cost: 0
  },
  changeCost: function() {
    var cc = (this.data.quanA * this.data.priceA + this.data.quanB * this.data.priceB + this.data.quanC * this.data.priceC)
    this.setData({
      cost: cc
    })
  },
  bindNameInput: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindPickerClassChange: function(e) {
    this.setData({
      indexClass:e.detail.value
    })
  },
  bindInputBoxQuantityA: function(e) {
    debugger;
    this.data.quanA = parseInt(e.detail.value);
    changeCost;
  },
  // bindInputBoxQuantityB: function (e) {
  //   var quan = parseInt(e.detail.value);
  //   if (quan < 0) {
  //     this.setData({ submitMessage: 'No negative quanities' })
  //   } else {
  //     this.setData({ 
  //     quanB: quan,
  //     cost: (quanA * priceA + quanB * priceB + quanC * priceC)})
  //   }
  // },
  // bindInputBoxQuantityC: function (e) {
  //   var quan = parseInt(e.detail.value);
  //   if (quan < 0) {
  //     this.setData({ submitMessage: 'No negative quanities' })
  //   } else {
  //     this.setData({
  //       quanC: e.detail.value,
  //       cost: (quanA * priceA + quanB * priceB + quanC * priceC)})
  //   }
  // },
  onSubmit: function () {
    if (this.data.BuyerName == '' || this.data.buyerName == ' ') {
      submitMessage="Fill in your name"
    } else {
      // post to the server
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
          console.log(res);
          this.setData({ submitMessage: res.data });
        }.bind(this)
      });
    }
  },
})
