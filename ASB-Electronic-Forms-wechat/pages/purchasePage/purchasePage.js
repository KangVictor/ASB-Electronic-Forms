const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    buyerName: '',
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',

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
      title: 'ASB Electronic Form',
    })
    // request to the server for price and quantities of the item
    const murl = 'http://localhost:5000/getitem';
    wx.request({
      url: murl,
      method: 'GET',
      success: function (res) {
        const getPrices = res.data['itemPrice'];
        const getNames = res.data['itemName'];
        const getNum = res.data['itemNum'];
        this.setData({
          itemNum: getNum,
          itemNames: getNames,
          itemPrices: getPrices
        })
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      }
    });
    // make quan = [0, 0, 0]
    for(var i = 0; i < this.data.itemNum; i++) {
      this.data.quan[i] = 0;
    }
  },
  
  //////////////////////
  //input 
  bindNameInput: function (e) {
    if (hasNumber(e.detail.value)) { // check if name contains number
      wx.showModal({
        title:'error',
        content:'No numbers in name!',
        showCancel: false,
        confirmText: 'Ok'
      })
    }
    this.setData({
      buyerName: e.detail.value
    })
  },
  bindPickerGradeChange: function (e) {
    this.setData({
      indexGrade: e.detail.value
    })
  },
  bindPickerClassChange: function (e) {
    this.setData({
      indexClass: e.detail.value
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
    for(var i = 0; i < this.data.quan.length; i++) {
      if (this.data.quan[i] < 0) {
        showNoNegativeModal();
      }
    }
    if (this.data.buyerName == '') {// if buyer's name is blank
      // should change to error message later on
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
    else if(hasNumber(this.data.buyerName)) { // incorrect name or quantity
      wx.showModal({
        title: 'Error',
        content: 'No numbers in name!',
        confirmText: 'Ok',
        showCancel: false
      })
    }
    else { // can submit in this circumstance
      const murl = 'http://localhost:5000/create/order';
      const mbody = JSON.stringify({ "BuyerName": this.data.buyerName, "BuyerGrade": this.data.arrayGrade[this.data.indexGrade], "BuyerClass": this.data.arrayClass[this.data.indexClass], "BuyerCost": this.data.cost, "Quantity": this.data.quan});
      wx.showModal({
        tittle: 'Confirm',
        content: 'Are you sure to submit?',
        cancelText: 'No',
        confirmText: 'Submit',
        success(res) {
          if(res.confirm) {
            // navigate to submitPage and send buyerName, class, and cost
            wx.request({
              url: murl,
              method: 'POST',
              data: mbody,
              headers: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                //navigate to 
                wx.navigateTo({
                  url: '/pages/submitPage/submitPage?',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                });
              }.bind(this),
              fail: function () {
                wx.navigateTo({
                  url: '/pages/submitFailPage/submitFailPage?',
                });
              }
            });
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