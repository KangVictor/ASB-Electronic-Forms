// pages/userSelect/index.js
Page({
  data: {
    adminButtonDisabled: true, // if admin = false, if nonadmin = true
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1500,
    imgUrls: ['/resources/brownies.jpeg', '/resources/candy-cane.jpeg', '/resources/chocolate.jpeg', '/resources/gingerbread.jpg', '/resources/sugar-cookies.jpg'],
    backColor: '#f8f8f8',
    adminAccounts:[]
  },

  onLoad: function() {
    var getOpenId=''
    var adminAccounts = []
    const self = this;

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getWhiteList',
      success: function (res) {
        adminAccounts = res.result.data
        if (isAdmin(adminAccounts, getOpenId)) {
          self.setData({
            adminButtonDisabled: false
          })
        }
      },
    })

    wx.cloud.callFunction({
      name: 'checkID',
      success: function(res){
        console.log(res.result.openid)
        getOpenId = res.result.openid
        if (isAdmin(adminAccounts, getOpenId)) {
          self.setData({
            adminButtonDisabled: false
          })
        }
      }
    })

    // change navigation bar color
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3f9675',
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
      url: '/pages/checkReservationPage/checkReservationPage?'
    });
  },

  bindGoReserve: function () {
    wx.navigateTo({ // navigate to go reservation Page
      url: '/pages/reservationPage/reservationPage?'
    });
  },
})

function isAdmin(adminList, userOpenId) {
  // console.log(adminList)
  // console.log(userOpenId)
  var check = false
  for(var i = 0; i < adminList.length; i++){
    if(userOpenId == adminList[i]['openId']) {
      check = true
    }
  }
  return check
}
