// pages/checkReservationPage/checkReservationPage.js
Page({
  data: {
    reservation:[],
    firstten:[],
    showReservation: [],
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
      title: 'reservation check',
    })

    wx.showLoading({
      title: 'Loading...',
    })

    // request to the server for reservation
    wx.cloud.callFunction({
      name: 'getReservations',
      success: function(res) {
        const getReservation = res.result.data
        console.log(getReservation);
        this.setData({ // give reservation the the entire data of reservation
          reservation: getReservation,
        })
        
        var recent = []; // recent 15 reservation are shown
        for (var i = 0; i < 15; i++) {
          recent[i] = getReservation[getReservation.length - i - 1]
        }
        this.setData({
          showReservation: recent
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

  searchReservation: function() {
    if (this.data.keyword == '') {// if keyword(name, code) is blank just show all reservation
      this.setData({showReservation: this.data.reservation})
    } else {
      console.log('in')
      const foundreservation = findReservation(this.data.reservation, (this.data.keyword).toLowerCase());
      console.log(foundreservation);
      if (foundreservation.length == 0) {
        wx.showModal({
          title: 'not found',
          content: 'Buyer name not found',
          confirmText: 'Ok',
          showCancel: false
        })
        console.log("buyer not found")
      } else {
        this.setData({
          showReservation: [],
          
        })
        this.setData({showReservation:foundreservation})
      }
    }
  },

  onConfirm: function(event) {
    console.log(event.currentTarget.id)
    wx.showLoading({
      title: 'Loading',
    })
    // find the confirmed variable
    var index
    for(var i = 0; i < this.data.reservation.length; i++){
      if(this.data.reservation[i]._id == event.currentTarget.id) {
        index = i
        break
      }
    }
    // confirm the selected reservation
    wx.cloud.callFunction({
      name: "confirmReservation",
      data: {
        reservationId: Number.parseInt(event.currentTarget.id),
        confirmed: this.data.reservation[index].confirmed,
      },
      success: function (res) {
        this.data.reservation[index].confirmed = !this.data.reservation[index].confirmed
        for (var i = 0; i < this.data.showReservation.length; i++) {
          if (this.data.showReservation[i]._id == event.currentTarget.id) {
            this.data.showReservation[i].confirmed == !this.data.showReservation[i].confirmed
            break
          }
        }
        wx.hideLoading()
      }.bind(this)
    })
  }
})

function findReservation(reservation, keyword) { // finds Reservation either by code or name
  var foundreservation = [];
  var count = 0;

  if(hasNumber(keyword)){ // checks if the keyWord is a code
  // find the code if so
    for (var i = 0; i < reservation.length; i++) {
      if (reservation[i]['_id'] == Number(keyword)) {
        foundreservation[count] = reservation[i]
        count ++;
      }
    }
  } else { // find the buyer's name
    console.log(reservation)
    for (var i = 0; i < reservation.length; i++) {
      if (reservation[i]['studentName'] == keyword){
        foundreservation[count] = reservation[i];
        count++;
      }
    }
  }
  return foundreservation;
}

function hasNumber(myString) { // Check if the name contains integer
  return /\d/.test(myString);
}
