// pages/userSelect/index.js
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    adminAccounts: ["https://wx.qlogo.cn/mmopen/vi_32/xXh05DXhjejibarmQN1Nc3TgctlEfUVr8nbUSwaeuGmor9icWOsK3BwUSLhs3yFTUKu5lxFLfAOSlVMBfLTJFccA/132"], // admin accounts' avatarUrl
    adminButtonDisabled: false // if admin = false, if nonadmin = true
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
    var nonAdmin = true;
    wx.getUserInfo({
      success(res) {
        console.log(res.userInfo.avatarUrl);
      }
    })
    for(var i = 0; i < this.data.adminAccounts.length; i++) {
      if (e.detail.userInfo['avatarUrl'] == this.data.adminAccounts[i]) { // if not admin, disable the admin button
        nonAdmin = false;
        console.log('is Admin');
      }
    }
    this.setData({ adminButtonDisabled: nonAdmin });
    if(this.data.nonAdmin == true) {
      wx.showModal({
        title: 'error',
        content: 'Only ASB members can use this function',
        showCancel: false,
        confirmText: 'Ok'
      })
    } else {
      wx.navigateTo({ // later create choosing page that can choose between file access
        url: '/pages/checkOrderPage/checkOrderPage?'
      });
    }
  },

  bindPurchase: function () {
    wx.navigateTo({ // navigate to purchasePage
      url: '/pages/purchasePage/purchasePage?'
    });
  },
})