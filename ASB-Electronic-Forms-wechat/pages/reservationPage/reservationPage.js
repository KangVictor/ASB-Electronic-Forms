const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    studentLastName: '',
    studentFirstName:'',
    studentGrade: 9,
    studentClass: 1,
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',

    firstNameFilled: '*',
    lastNameFilled: '*',
    fillInTextHidden: false,

    reserveButtonDisabled: false,

    quan: [0, 0, 0],
    item: [5, 8, 15],
    itemNames: ['Single Tube Watergun', 'Double Tube Watergun', 'Classic Watergun'],
    itemNum: 3,
    total: 0
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
      title: 'Reserve',
    })
  },
  
  //////////////////////
  //input 
  bindFirstNameInput: function (e) {
    var english = /^[A-Za-z\s]*$/;
    if (! e.detail.value.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title:'error',
        content:'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    } else {
      this.setData({
        studentFirstName: e.detail.value
      })
      if (e.detail.value != '' && e.detail.value != ' ') {
        if (this.data.lastNameFilled == '') {
          this.setData({  fillInTextHidden: true })
        }
        this.setData({ firstNameFilled: ''})
      } else {
        this.setData({  fillInTextHidden: false, firstNameFilled: '*' })
      }
    }
  },
  bindLastNameInput: function (e) {
    var english = /^[A-Za-z\s]*$/;
    if (!e.detail.value.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title: 'error',
        content: 'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    } else {
      this.setData({
        studentLastName: e.detail.value
      })
      if (e.detail.value != '' && e.detail.value != ' ') {
        if (this.data.firstNameFilled == '') {
          this.setData({ fillInTextHidden: true })
        }
        this.setData({ lastNameFilled: '' })
      } else {
        this.setData({ fillInTextHidden: false, lastNameFilled: '*' })
      }
    }
  },

  bindPickerGradeChange: function (e) {
    const getGrade = this.data.arrayGrade[this.data.indexGrade];
    this.setData({
      indexGrade: e.detail.value,
      studentGrade: getGrade
    })
  },
  bindPickerClassChange: function (e) {
    const getClass = this.data.arrayClass[this.data.indexClass];
    this.setData({
      indexClass: e.detail.value,
      studentClass: getClass
    })
  },
  bindInputBoxQuantityA: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[0] = input;
    if(this.data.quan[0] < 0){
      showNoNegativeModal();
    } else{
      var ctotal = changeTotal(this.data);
      this.setData({ total: ctotal})
    }
  },
  bindInputBoxQuantityB: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[1] = input;
    if (this.data.quan[1] < 0) {
      showNoNegativeModal();
    } else {
      var ctotal = changeTotal(this.data);
      this.setData({ total: ctotal })
    }
  },
  bindInputBoxQuantityC: function (e) {
    var input = getQuantity(e.detail.value);
    this.data.quan[2] = input;
    if (this.data.quan[0] < 0) {
      showNoNegativeModal();
    } else {
      var ctotal = changeTotal(this.data);
      this.setData({ total: ctotal })
    }
  },
  //////////////////////

  onReserveButton: function () {
    var english = /^[A-Za-z\s]*$/;
    for(var i = 0; i < this.data.quan.length; i++) {
      if (this.data.quan[i] < 0) {
        showNoNegativeModal();
      }
    }
    if (this.data.studentFirstName == '' || this.data.studentLastName == '') {// if student's name is blank
      wx.showModal({
        title: 'Error',
        content: 'Please fill in your name!',
        confirmText: 'Ok',
        showCancel: false
      })
    }
    else if (this.data.total == 0) {
      wx.showModal({
        title: 'Error',
        content: "You can't reserve nothing ;-;",
        confirmText: 'Ok',
        showCancel: false
      })
    }
    else if (!this.data.studentFirstName.match(english) || !this.data.studentLastName.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title: 'error',
        content: 'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    }
    else { // can reserve in this circumstance
      const studentNa = this.data.studentFirstName + ' ' + this.data.studentLastName;
      const studentCl = this.data.studentClass;
      const studentGr = this.data.studentGrade;
      const studentQu = this.data.quan;
      const studentTo = this.data.total;

      this.setData({ reserveButtonDisabled: true })
      const self = this;
      wx.showModal({
        title: 'Confirm',
        content: studentNa + studentGr + '(' + studentCl + ')' + '\n' + 'are you sure to reserve?',
        cancelText: 'No',
        confirmText: 'Submit',
        success(res) {
          if(res.confirm) { // if the student wants to submit
            wx.cloud.init();
            wx.showLoading({
              title: 'Confirming',
            })
            wx.cloud.callFunction({
              name: "postReservation",
              data: {
                studentName: studentNa,
                studentGrade: studentGr,
                studentClass: studentCl,
                studentTotal: studentTo,
                studentQuan: studentQu
              },
              success: (res) => {
                wx.hideLoading()
                console.log('case a')
                if(res.result == "fail") {
                  wx.navigateTo({ // if failed, navigate to submit fail page
                    url: '/pages/submitFailPage/submitFailPage?',
                  });
                } else {
                  wx.navigateTo({ // if successfully sent reservation, navigate to submit page
                    url: '/pages/submitPage/submitPage?id=code: ' + res.result.toString() + " name: " + studentNa,
                  });
                }
              },
              fail: (res) => {
                console.log('case b')
                wx.hideLoading()
                wx.navigateTo({ // if failed to send reservation, navigate to submit fail page
                  url: '/pages/submitFailPage/submitFailPage?',
                });
              }
            })
          } else {
            console.log('in')
            self.setData({reserveButtonDisabled:false})
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

function changeTotal(data) { // Calculates the total
  var ctotal = 0;
  for(var count = 0; count < data.itemNum; count++) {
    if (data.quan[count] != null){
      ctotal += data.quan[count] * data.item[count]
    }
  }
  return ctotal;
}

function getQuantity(num) { // if no number, 0, if integer, parse it and return'
  if (num == '' || parseInt(num) < 0) {
    return 0;
  } 
  return parseInt(num);
}