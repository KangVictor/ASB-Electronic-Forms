// pages/checkReservationPage/checkReservationPage.js
Page({
  data: {
    reservation:[],
    firstten:[],
    showReservation: [],
    itemNum: 9,
    items: [
      {name: 'Red Rose', quantity: 0, value: 5, imgUrl: '/resources/520/red-rose.jpg', itemNum:0},
      {name: 'Champagne Rose', quantity: 0, value: 5, imgUrl: '/resources/520/champagne-rose.jpg', itemNum: 1},
      {name: 'Succulent Pot', quantity: 0, value: 6, imgUrl: '/resources/520/succuelnt-pot.jpg', itemNum: 2},
      {name: 'Sunflower', quantity: 0, value: 10, imgUrl: '/resources/520/sunflower.jpg', itemNum:3},
      {name: 'Daisy Bouquet', quantity: 0, value: 35, imgUrl: '/resources/520/daisy-bouquet.jpg', itemNum: 4},
      {name: '6 Sunflower Bouquet', quantity: 0, value: 55, imgUrl: '/resources/520/6-sunflower-bouquet.jpg', itemNum:5},
      {name: '11 Red Rose Bouquet', quantity: 0, value: 60, imgUrl: '/resources/520/11-red-rose-bouquet.jpg', itemNum: 6},
      {name: '11 Champagne Rose Bouquet', quantity: 0, value: 65, imgUrl: '/resources/520/11-champagne-rose-bouquet.jpg', itemNum: 7},
      {name: '99 Rose Bouquet', quantity: 0, value: 450, imgUrl: '/resources/520/99-rose-bouquet.jpg', itemNum: 8},
    ],
    keyword:'',
    currentPage: 0,
    numResPerPage: 10,
    hasNext: true,
    hasPrev: false
  },

  onLoad: function() {
    console.log(this.data.items[0].name)
    // request to the server for price and quantities of the item
    wx.cloud.init();
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
      const getReservation = this.data.reservation.slice(0,this.data.numResPerPage)
      this.setData({ showReservation: getReservation })
    } else {
      const foundreservation = findReservation(this.data.reservation, (this.data.keyword).toLowerCase());
      console.log(foundreservation);
      if (foundreservation.length == 0) {
        wx.showToast({
          title: 'not found',
          icon: 'none',
          duration: 800
        })
      } else {
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
    console.log(matchingReservation)

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
