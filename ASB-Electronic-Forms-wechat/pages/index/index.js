// pages/userSelect/index.js
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isNonadmin: true // if admin = false, if nonadmin = true
  },

  onLoad() {
    var nonadmin = true;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              const userInfo = res.userInfo
              const nickName = userInfo.nickName
              const avatarUrl = userInfo.avatarUrl
              const gender = userInfo.gender // 性别 0：未知、1：男、2：女
              if (userInfo.avatarUrl == "https://wx.qlogo.cn/mmopen/vi_32/AZcdnX51icE5f7caIeMrHGCMiaNsR7wicicKPe5L5uBTmInG16oOezBkCSpNRagXWW4b8AqZgicdF6m2XnEiafrv9qZw/132") { // ASB account access 
                nonadmin = false;
              }
              console.log(res.user)
              console.log(res.userInfo)
            }
          })
        }
      }
    })
    // this.setData({
    //   isNonadmin: nonadmin
    // })
    // console.log(nonadmin)
    // console.log(this.data.isNonadmin)
  },
  bindPurchase: function () {
    wx.navigateTo({ // navigate to purchasePage
      url: '/pages/purchasePage/purchasePage?'
    });
  },
  bindAdmin: function() {
    wx.navigateTo({ // later create choosing page that can choose between file access and purchase
      url: '/pages/purchasePage/purchasePage?'
    });
  },
})