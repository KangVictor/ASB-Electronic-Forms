// pages/checkOrderPage/checkOrderPage.js
Page({

  data: {

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

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})