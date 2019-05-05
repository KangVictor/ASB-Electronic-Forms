// pages/checkOrderPage/checkOrderPage.js
Page({

  data: {
    orders:[],
    keyword:''
  },

  onLoad: function(options) {
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'getOrder',
      success: function(res) {
        const getorder = res.result.data
        console.log(getorder[0])
        this.setData({
          orders:getorder[0]['buyerName']
        })
      }.bind(this)
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  searchOrders: function() {
    console.log(this.data.orders)
    const foundOrders = findOrder(this.data.orders, this.data.keyword);
    if (foundOrders == []) {
      this.setData({
        orders:['not found']
      })
    } else {
      this.setData({
        orders:foundOrders
      })
    }
  }
  
})

function findOrder(orders, keyword) { // finds order either by code or name
  var foundOrders = [];
  var count = 0;

  if(hasNumber(keyword)){ // checks if the keyWord is a code
  // find the code if so
    for (var i = 0; i < orders.length; i++) {
      if (orders[i]['code'] == Number(keyword)) {
        foundOrders[count] = orders[i]
        count ++;
      }
    }
  } else { // find the buyer's name
    for (var i = 0; i < orders.length; i++) {
      if (orders[i]['name'] == keyword){
        foundOrders[count] = orders[i];
        count++;
      }
    }
  }

  return foundOrders;
}

function hasNumber(myString) { // Check if the name contains integer
  return /\d/.test(myString);
}