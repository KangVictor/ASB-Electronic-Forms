// pages/userSelect/index.js
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    adminAccounts: ["https://wx.qlogo.cn/mmopen/vi_32/xXh05DXhjejibarmQN1Nc3TgctlEfUVr8nbUSwaeuGmor9icWOsK3BwUSLhs3yFTUKu5lxFLfAOSlVMBfLTJFccA/132"], // admin accounts' avatarUrl
    adminButtonDisabled: false // if admin = false, if nonadmin = true
  },

  onLoad: function() {
    // wx.cloud.init()
    // wx.cloud.callFunction({
    //   name: 'getUserInfo',
    //   success: function (res) {
    //     if(res.unionid == 'Victor030330'){
    //       adminButtonDisabled = false
    //     }
    //   },
    //   fail: function (res){
    //     console.log('fail')
    //   }
    // })
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx3766d060f51ec08a&secret=4479f86f657f87374e1b5226519cd73b&js_code=${res.code}&grant_type=authorization_code`,
            data: {
              code: res.code
            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
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

  onReady: function(){
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  bindGetUserInfo(e) {
    wx.navigateTo({
      url: '/pages/adminLoginPage/adminLoginPage?'
    });

    // check if the user is admin(ASB member)
    // var nonAdmin = false;
    // wx.getUserInfo({
    //   success(res) {
    //     console.log(res.userInfo);
    //   }
    // })
    // for(var i = 0; i < this.data.adminAccounts.length; i++) {
    //   if (e.detail.userInfo['avatarUrl'] == this.data.adminAccounts[i]) { // if not admin, disable the admin button
    //     nonAdmin = false;
    //     console.log('is Admin');
    //   }
    // }
    // this.setData({ adminButtonDisabled: nonAdmin });
    // if(nonAdmin == true) {
    //   wx.showModal({
    //     title: 'error',
    //     content: 'Only ASB members can use this function',
    //     showCancel: false,
    //     confirmText: 'Ok'
    //   })
    // } else {
      // wx.navigateTo({ // later create choosing page that can choose between file access
      //   url: '/pages/checkOrderPage/checkOrderPage?'
      // });
    // }
  },

  bindPurchase: function () {
    wx.navigateTo({ // navigate to purchasePage
      url: '/pages/purchasePage/purchasePage?'
    });
  },
})