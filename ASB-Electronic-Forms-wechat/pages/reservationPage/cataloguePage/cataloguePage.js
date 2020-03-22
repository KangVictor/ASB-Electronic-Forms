const app = getApp()

Page({
  data: {
    exArray: [1,2],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //input related
    studentName:'',
    studentGrade: 9,
    studentClass: 1,
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',

    nameFilled: '*',
    fillInTextHidden: false,

    reserveButtonDisabled: false,

    items: [
      // { name: 'Single Tube Watergun', quantity: 0, value: 5 },
      // { name: 'Double Tube Watergun', quantity: 0, value: 8 },
      // { name: 'Classic Watergun', quantity: 0, value: 15 }
      {name: 'Candy Cane', quantity: 0, value: 3, imgUrl: '/resources/candy-cane.jpeg', itemNum:0},
      {name: 'Chocolate', quantity: 0, value: 5, imgUrl: '/resources/chocolate.jpeg', itemNum: 1},
      {name: 'Brownie', quantity: 0, value: 10, imgUrl: '/resources/brownies.jpeg', itemNum: 2},
      {name: 'Gingerbread Cookie', quantity: 0, value: 15, imgUrl: '/resources/gingerbread.jpg', itemNum: 3,},
      {name: 'Sugar Cookie', quantity: 0, value: 10, imgUrl: '/resources/sugar-cookies.jpg', itemNum: 4}
    ],
    recipients: [ // format: { rName: 'a', rGrade: 9, rItem: 0, rClass: 1, rQuantity: 1 }
    ],
    itemNum: 5,
    total: 0
  },
  
  //////////////////////
  //input 
  bindNameInput: function (e) {
    var english = /^[A-Za-z\s]*$/; //regex
    if (! e.detail.value.match(english)) { // check if name contains nonEnglish letters
      wx.showModal({
        title:'error',
        content:'Accepts English Letters Only',
        showCancel: false,
        confirmText: 'Ok'
      })
    } else {
      this.setData({
        studentName: e.detail.value
      })
      if (e.detail.value != '' && e.detail.value != ' ') {
        if (this.data.nameFilled == '') {
          this.setData({  fillInTextHidden: true })
        }
        this.setData({ nameFilled: ''})
      } else {
        this.setData({  fillInTextHidden: false, firstNameFilled: '*' })
      }
    }
  },
  
  bindPickerGradeChange: function (e) {
    const getGrade = this.data.arrayGrade[e.detail.value];
    this.setData({
      indexGrade: e.detail.value,
      studentGrade: getGrade
    })
  },

  bindPickerClassChange: function (e) {
    const getClass = this.data.arrayClass[e.detail.value];
    this.setData({
      indexClass: e.detail.value,
      studentClass: getClass
    })
  },

  onAddRecipient: function(e) {
    // find item to add recipient
    var i;
    for(i = 0;i < this.data.items.length; i++){
      if(this.data.items[i].name == e.currentTarget.id){
        break;
      }
    }
    this.data.recipients.push({rName:'', rGrade: 9, rClass:1, rItem:i, rQuantity: 1, deleted: false})

    // Without changing value with setData, UI(WXML)is not updated
    var tempRecipients = this.data.recipients
    this.setData({
      recipients: tempRecipients
    })
  },

  onRecipientNameInput: function(e) {
    var targetIndex = e.detail.id
    var name = e.detail.name
    this.data.recipients[targetIndex].rName = name
    console.log(this.data.recipients)
  },

  onRecipientGradeChange: function (e) {
    var targetIndex = e.detail.id
    var changedGrade = Number(e.detail.grade)
    this.data.recipients[targetIndex].rGrade = changedGrade
    console.log(this.data.recipients)
  },

  onRecipientClassChange: function (e) {
    var targetIndex = e.detail.id
    var changedClass = Number(e.detail.classnum)
    this.data.recipients[targetIndex].rClass = changedClass
    console.log(this.data.recipients)
  },

  onRecipientQuantityInput: function (e) {
    var targetIndex = e.detail.id
    var changedQuantity = Number(e.detail.quantity)
    this.data.recipients[targetIndex].rQuantity = changedQuantity
    console.log(this.data.recipients)
  },

  onDeleteRecipient: function (e) {
    var targetIndex = e.detail.id
    // this.data.recipients.splice(targetIndex, 1)
    
    this.data.recipients[targetIndex].deleted = true
    this.data.recipients[targetIndex].rQuantity = 0

    var tempRecipients = this.data.recipients
    this.setData({
      recipients: tempRecipients
    })
    console.log(this.data.recipients)
  },

  onReserveButton: function () {
    var english = /^[A-Za-z\s]*$/;
    if (this.data.studentName == '') {// if student's name is blank
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
    else if (!this.data.studentName.match(english)) { // check if name contains nonEnglish letters
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
      const studentNa = this.data.studentName;
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