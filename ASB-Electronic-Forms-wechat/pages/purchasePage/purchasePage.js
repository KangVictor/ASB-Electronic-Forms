const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    buyerName: '',
    buyerGrade: 9,
    buyerClass: 1,
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',

    nameFilled: '*',
    fillInTextHidden: false,

    quan: [],
    itemPrices: [],
    itemNames: [],
    itemNum: 0,
    cost: 0
  },

  onLoad() {
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
      title: 'Purchase Page ',
    })
    // request to the server for price and quantities of the item
    wx.cloud.init();
    wx.showLoading({
      title: 'Loading Items...',
    })
    wx.cloud.callFunction({
      name: 'getItemInfo',
      success: function (res) {
        console.log(res);
        const getPrices = res.result.data.itemPrice;
        const getNames = res.result.data.itemName;
        const getNum = res.result.data.itemNum;
        this.setData({
          itemNum: getNum,
          itemNames: getNames,
          itemPrices: getPrices
        })
        // make quan = [0, 0, 0, ...]
        for (var i = 0; i < this.data.itemNum; i++) {
          this.data.quan[i] = 0;
        }
        wx.hideLoading()
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?'
        });
      }
    })
  },
  
  //////////////////////
  //input 
  bindNameInput: function (e) {
    var english = /^[A-Za-z\s]*$/;
    if (! e.detail.value.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title:'error',
        content:'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    }
    this.setData({
      buyerName: e.detail.value
    })
    if (e.detail.value != '' && e.detail.value != ' ') {
      this.setData({nameFilled : '', fillInTextHidden: true})
    } else { this.setData({ nameFilled: '*', fillInTextHidden :false })}
  },
  bindPickerGradeChange: function (e) {
    const getGrade = this.data.arrayGrade[this.data.indexGrade];
    this.setData({
      indexGrade: e.detail.value,
      buyerGrade: getGrade
    })
  },
  bindPickerClassChange: function (e) {
    const getClass = this.data.arrayClass[this.data.indexClass];
    this.setData({
      indexClass: e.detail.value,
      buyerClass: getClass
    })
  },
  bindInputBoxQuantityA: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[0] = input;
    if(this.data.quan[0] < 0){
      showNoNegativeModal();
    } else{
      var ccost = changeCost(this.data);
      this.setData({ cost: ccost})
    }
  },
  bindInputBoxQuantityB: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[1] = input;
    if (this.data.quan[1] < 0) {
      showNoNegativeModal();
    } else {
      var ccost = changeCost(this.data);
      this.setData({ cost: ccost })
    }
  },
  bindInputBoxQuantityC: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[2] = input;
    if (this.data.quan[0] < 0) {
      showNoNegativeModal();
    } else {
      var ccost = changeCost(this.data);
      this.setData({ cost: ccost })
    }
  },
  //////////////////////

  onSubmit: function () {
    var english = /^[A-Za-z\s]*$/;
    for(var i = 0; i < this.data.quan.length; i++) {
      if (this.data.quan[i] < 0) {
        showNoNegativeModal();
      }
    }
    if (this.data.buyerName == '') {// if buyer's name is blank
      wx.showModal({
        title: 'Error',
        content: 'Please fill in your name!',
        confirmText: 'Ok',
        showCancel: false
      })
    } 
    else if (this.data.cost == 0) {
      wx.showModal({
        title: 'Error',
        content: 'Please buy something ;-;',
        confirmText: 'Ok',
        showCancel: false
      })
    }
    else if (!this.data.buyerName.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title: 'error',
        content: 'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    }
    else { // can submit in this circumstance
      const buyerNa = this.data.buyerName;
      const buyerCl = this.data.buyerClass;
      const buyerGr = this.data.buyerGrade;
      const buyerQu = this.data.quan;
      const buyerCo = this.data.cost;
      wx.showModal({
        title: 'Confirm',
        content: 'Are you sure to submit?',
        cancelText: 'No',
        confirmText: 'Submit',
        success(res) {
          if(res.confirm) { // if the buyer wants to submit
            wx.cloud.init();
            wx.cloud.callFunction({
              name: "postOrder",
              data: {
                buyerName: buyerNa,
                buyerGrade: buyerGr,
                buyerClass: buyerCl,
                buyerCost: buyerCo,
                buyerQuan: buyerQu
              },
              success: (res) => {
                if(res.result == "fail") {
                  wx.navigateTo({ // if failed to add order, navigate to submit fail page
                    url: '/pages/submitFailPage/submitFailPage?',
                  });
                } else {
                  wx.navigateTo({ // if successfully sent order, navigate to submit page
                    url: '/pages/submitPage/submitPage?id=code: ' + res.result.toString() + " name: " + buyerNa,
                  });
                }
              },
              fail: (res) => {
                wx.navigateTo({ // if failed to send order, navigate to submit fail page
                  url: '/pages/submitFailPage/submitFailPage?',
                });
              }
            })
          }
        }
      });
    }
  },
})

function showNoNegativeModal() {
  wx.showModal({
    title: 'Error',
    content: 'No negative quantity',
    confirmText: 'Ok',
    showCancel: false
  })
}

function hasNumber(myString) { // Check if the name contains integer
  return /\d/.test(myString);
}

function changeCost(data) { // Calculates the cost
  var ccost = 0;
  for(var count = 0; count < data.itemNum; count++) {
    if (data.quan[count] != null){
      ccost += data.quan[count] * data.itemPrices[count]
    }
  }
  return ccost;
}

function getQuantity(num) { // if no number, 0, if integer, parse it and return'
  if (num == '' || parseInt(num) < 0) {
    return 0;
  } 
  return parseInt(num);
}