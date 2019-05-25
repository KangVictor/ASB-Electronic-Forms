Page({
  data: {
    code: 'err'
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: 'Submit Succes',
    })
    console.log(option.id)
    this.setData({code: option.id});
  },
  returnHome: function() {
    wx.navigateBack({
      delta: 2
    })
  }
})