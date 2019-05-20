// pages/userSelect/index.js
Page({
  data: {
    adminButtonDisabled: true, // if admin = false, if nonadmin = true
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1500,
    imgUrls: ['/itemImg/singleWG.jpg', '/itemImg/doubleWG.jpg', '/itemImg/classicWG.jpg'],
    backColor: '#f8f8f8',
    adminAccounts:[]
  },

  onLoad: function() {
    var getOpenId=''
    var self = this
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
              console.log(res.data.openid)
              if(isAdmin(adminAccounts, getOpenId)){
                self.setData({
                  adminButtonDisabled: false
                })
              }
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
        console.log('in')
        adminAccounts = res.result.data
        if (isAdmin(adminAccounts, getOpenId)) {
          self.setData({
            adminButtonDisabled: false
          })
        }
      },
    })

    setTimeout(function(){
      if (isAdmin(adminAccounts, getOpenId)) {
        self.setData({
          adminButtonDisabled: false
        })
      }
    }, 8000)

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
  console.log(adminList)
  console.log(userOpenId)
  var check = false
  for(var i = 0; i < adminList.length; i++){
    if(userOpenId == adminList[i]['openId']) {
      check = true
    }
  }
  return check
}
