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

    items: [
      { name: 'Single Tube Watergun', quantity: 0, value: 5 },
      { name: 'Double Tube Watergun', quantity: 0, value: 8 },
      { name: 'Classic Watergun', quantity: 0, value: 15 }
    ],
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

  bindInputBoxQuantity: function (e) {
    var input = getQuantity(e.detail.value);
    for(var i = 0; i < this.data.itemNum; i++) { // find the target item with name given by id
      if(this.data.items[i].name == e.currentTarget.id) {
        this.data.items[i].quantity = input;
      }
    }
    var ctotal = changeTotal(this.data);
    this.setData({ total: ctotal})
  },
  //////////////////////

  onReserveButton: function () {
    var english = /^[A-Za-z\s]*$/;
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
      var studentQu = [];
      for(var i = 0; i < this.data.itemNum; i++) {
        studentQu[i] = this.data.items[i].quantity
      }
      const studentNa = this.data.studentFirstName + ' ' + this.data.studentLastName;
      const studentCl = this.data.studentClass;
      const studentGr = this.data.studentGrade;
      const studentTo = this.data.total;

      this.setData({ reserveButtonDisabled: true })
      const self = this;
      wx.showModal({
        title: 'Confirm',
        content: studentNa + " " + studentGr + '(' + studentCl + ') ' + 'will you reserve?',
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

function hasNumber(myString) { // Check if the name contains integer
  return /\d/.test(myString);
}

function changeTotal(data) { // Calculates the total
  var ctotal = 0;
  for(var count = 0; count < data.itemNum; count++) {
    if (data.items[count].quantity != null){
      ctotal += data.items[count].quantity * data.items[count].value
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