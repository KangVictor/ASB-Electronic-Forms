// pages/checkOrderPage/checkOrderPage.js
Page({

  data: {
    orders: 'error'
  },

  onLoad: function (options) {
    var getOrder;
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'getOrder',
      success: function(res) {
        getOrder = res.data
      }
    })
    this.setData({
      orders: getOrder
    })
  },
})