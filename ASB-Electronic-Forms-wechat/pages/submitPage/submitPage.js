Page({
  data: {
    code: 'err'
  },
  onLoad(option) {
    console.log(option.id)
    this.setData({code: option.id});
  }
})