// pages/checkOrderPage/checkOrderPage.js
Page({

  data: {
    orders:[],
    firstten:[],
    showOrders: [],
    itemNum: 3,
    itemNames: ['Single Tube Watergun', 'Double Tube Watergun', 'Classic Watergun'],
    keyword:'',
    showNum: 5
  },

  onLoad: function() {
    // request to the server for price and quantities of the item
    wx.cloud.init();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#03A9AC',
      animation: {
        duration: 500,
        timingFunc: 'easeIn'
      }
    });
    wx.setNavigationBarTitle({
      title: 'Orders check',
    })

    wx.showLoading({
      title: 'Loading Orders...',
    })

    // request to the server for orders
    wx.cloud.callFunction({
      name: 'getOrder',
      success: function(res) {
        const getorder = res.result.data
        console.log(getorder);
        this.setData({ // give orders the the entire data of orders
          orders: getorder,
        })
        
        var recent = []; // recent 15 orders are shown
        for (var i = 0; i < 15; i++) {
          recent[i] = getorder[getorder.length - i - 1]
        }
        this.setData({
          showOrders: recent
        })

        wx.hideLoading()
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?'
        });
      }
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  searchOrders: function() {
    wx.cloud.callFunction({
      name: 'getOrder',
      success: function (res) {
        const getorder = res.result.data
        console.log(getorder);
        this.setData({ // give orders the the entire data of orders
          orders: getorder,
        })
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?'
        });
      }
    })

    if (this.data.keyword == '') {// if keyword(name, code) is blank just show all orders
      this.setData({showOrders: this.data.orders})
    } else {
      const foundOrders = findOrder(this.data.orders, (this.data.keyword).toLowerCase());
      console.log(foundOrders);
      if (foundOrders.length == 0) {
        wx.showModal({
          title: 'not found',
          content: 'Buyer name not found',
          confirmText: 'Ok',
          showCancel: false
        })
        console.log("buyer not found")
      } else {
        this.setData({
          showOrders: [],
          
        })
        this.setData({showOrders:foundOrders})
      }
    }
  },

  confirmOrder: function() {
    console.log('id: ' + this.data.showOrders[0]._id)
    wx.showLoading({
      title: 'Loading',
    })
    wx.cloud.callFunction({
      name: "confirmOrder",
      data:{
        orderId: this.data.showOrders[0]._id
      },
      success: function (res) {
        this.setData({ // give orders the the entire data of orders
          orders: res.result.data,
        })
        const foundOrders = findOrder(this.data.orders, (this.data.keyword).toLowerCase());
        this.setData({
          showOrders: foundOrders
        })
        wx.hideLoading()
      }.bind(this)
    })
  },

  unconfirmOrder: function() {
    console.log('id: ' + this.data.showOrders[0]._id)
    wx.showLoading({
      title: 'Loading',
    })
    wx.cloud.callFunction({
      name: "unconfirmOrder",
      data: {
        orderId: this.data.showOrders[0]._id
      },
      success: function (res) {
        this.setData({ // give orders the the entire data of orders
          orders: res.result.data,
        })
        const foundOrders = findOrder(this.data.orders, (this.data.keyword).toLowerCase());
        this.setData({
          showOrders: foundOrders
        })
        wx.hideLoading()
      }.bind(this)
    })
  }
})

function findOrder(orders, keyword) { // finds order either by code or name
  var foundOrders = [];
  var count = 0;

  if(hasNumber(keyword)){ // checks if the keyWord is a code
  // find the code if so
    for (var i = 0; i < orders.length; i++) {
      if (orders[i]['_id'] == Number(keyword)) {
        foundOrders[count] = orders[i]
        count ++;
      }
    }
  } else { // find the buyer's name
    for (var i = 0; i < orders.length; i++) {
      if (orders[i]['buyerName'] == keyword){
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
