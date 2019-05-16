// pages/userSelect/index.js
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    adminButtonDisabled: true, // if admin = false, if nonadmin = true
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    imgUrls: ['/itemImg/singleWG.jpg', '/itemImg/doubleWG.jpg', '/itemImg/classicWG.jpg'],
    backColor: '#ffffff',
    whiteFont: '#ffffff'
  },

  onLoad: function() {
    var getOpenId=''
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx3766d060f51ec08a&secret=4479f86f657f87374e1b5226519cd73b&js_code=${res.code}&grant_type=authorization_code`,
            data: { code: res.code },
            method: 'GET',
            header: { 'content-type': 'application/json'  },
            success(res) {
              getOpenId = res.data.openid
            }
          })
        }
      }
    })

    var adminAccounts = []
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getWhiteList',
      success: function (res) {
          adminAccounts = res.result.data
      },
    })

    setTimeout(function () {
      console.log(adminAccounts)
      console.log(getOpenId)
      if(isAdmin(adminAccounts, getOpenId)){
        this.setData({
          adminButtonDisabled: false,
          backColor:'#03A9AC'
        })
      }
    }.bind(this), 5000)

    // change navigation bar color
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#03A9AC',
      animation: {
        duration: 500,
        timingFunc: 'easeIn'
      }
    });
    wx.setNavigationBarTitle({
      title: 'ASB Electronic Form',
    })
  },

  onAdminButton() {
    wx.navigateTo({
      url: '/pages/checkOrderPage/checkOrderPage?'
    });

    
  },

  bindPurchase: function () {
    wx.navigateTo({ // navigate to purchasePage
      url: '/pages/purchasePage/purchasePage?'
    });
  },
})

function isAdmin(adminList, userOpenId) {
  var check = false
  for(var i = 0; i < adminList.length; i++){
    if(userOpenId == adminList[i]['openId']) {
      check = true
    }
  }
  return check
}