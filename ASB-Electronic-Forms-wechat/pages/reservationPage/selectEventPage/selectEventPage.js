// pages/reservationPage/selectEventPage/selectEventPage.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

 onWhiteValentineButton: function() {
   wx.navigateTo({
     url: '../whiteValentinePage/whiteValentinePage',
   })
 }
})