// pages/checkReservationPage/checkReservationPage.js
Page({
  data: {
    reservation:[],
    firstten:[],
    showReservation: [],
    itemNum: 3,
    itemNames: ['Single Tube Watergun', 'Double Tube Watergun', 'Classic Watergun'],
    keyword:'',
    currentPage: 0,
    numResPerPage: 10,
    hasNext: true,
    hasPrev: false
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
          showReservation: getReservation.slice(0, this.data.numResPerPage)
        })

        wx.hideLoading()
      }.bind(this),
      fail: function() {
        wx.navigateTo({
          url: '/pages/serverFailPage/serverFailPage?'
        });
      }
    })
  },

  bindSearchInput: function(e) {
    // change the keyword
    this.setData({
      keyword: e.detail.value
    })
    // search
    if (this.data.keyword == '') {// if keyword(name, code) is blank just show all reservation
      this.setData({ showReservation: this.data.reservation })
    } else {
      const foundreservation = findReservation(this.data.reservation, (this.data.keyword).toLowerCase());
      console.log(foundreservation);
      if (foundreservation.length == 0) {
        wx.showToast({
          title: '   not found   ',
          icon: 'none',
          duration: 800
        })
      } else {
        this.setData({
          showReservation: [],

        })
        this.setData({ showReservation: foundreservation })
      }
    }
  },

  onConfirm: function(event) {
    console.log(event.currentTarget.id)
    wx.showLoading({
      title: 'Loading',
    })
    // find the confirmed variable
    
    const matchingReservation = findMatchingReservation(event.currentTarget.id, this.data.reservation)

    // confirm the selected reservation
    wx.cloud.callFunction({
      name: "confirmReservation",
      data: {
        reservationId: Number.parseInt(event.currentTarget.id),
        confirmed: matchingReservation.confirmed,
      },
      success: function (res) {
        matchingReservation.confirmed = !matchingReservation.confirmed
        this.setData({
          showReservation: this.data.reservation.slice(0, 14)
        })
        wx.hideLoading()
      }.bind(this)
    })
  },
})

function findReservation(reservations, keyword) {
  let foundReservations
  if (hasNumber(keyword)) { // checks if the keyWord is a code
    // find the code if so
    foundReservations = reservations.filter((reservation) => { return (String(reservation._id)).includes(keyword); })
  } else { // find the buyer's name
    foundReservations = reservations.filter((reservation) => { return reservation.studentName.includes(keyword); })
  }
  return foundReservations
}

function hasNumber(myString) { // Check if the name contains integer
  return /\d/.test(myString);
}

function findMatchingReservation(id, model) {
  return model.find(element => {return element._id == id})
}
