// pages/checkOrderPage/checkOrderPage.js
Page({

  data: {
    orders:[],
    // showNames: [],
    // showGrades: [],
    // showClasses: [],
    // showQuans: [],
    // showCosts: [],
    showOrders: [],
    itemNum: 0,
    itemNames: [],
    itemPrices: [],
    keyword:'',
  },

  onLoad: function(options) {
    // request to the server for price and quantities of the item
    wx.cloud.init();
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
      }.bind(this),
      fail: function () {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?'
        });
      }
    })
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
          showOrders: getorder
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

    if (this.data.keyword == '') {// if keyword(name, code) is blank
      wx.showModal({
        title: 'Error',
        content: 'Please enter name or code of the customer',
        confirmText: 'Ok',
        showCancel: false
      })
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
        console.log("buyer's name not found")
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
        wx.cloud.callFunction({
          name: 'getOrder',
          success: function (res) {
            const getorder = res.result.data
            console.log(getorder);
            this.setData({ // give orders the the entire data of orders
              orders: getorder,
            })
            const foundOrders = findOrder(this.data.orders, (this.data.keyword).toLowerCase());
            this.setData({
              showOrders:foundOrders
            })
            wx.hideLoading()
          }.bind(this),
          fail: function () {
            wx.navigateTo({
              url: '/pages/serverFailPage/serverFailPage?'
            });
          }
        })
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
        wx.cloud.callFunction({
          name: 'getOrder',
          success: function (res) {
            const getorder = res.result.data
            console.log(getorder);
            this.setData({ // give orders the the entire data of orders
              orders: getorder,
            })
            const foundOrders = findOrder(this.data.orders, (this.data.keyword).toLowerCase());
            this.setData({
              showOrders: foundOrders
            })
            wx.hideLoading()
          }.bind(this),
          fail: function () {
            wx.navigateTo({
              url: '/pages/serverFailPage/serverFailPage?'
            });
          }
        })
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