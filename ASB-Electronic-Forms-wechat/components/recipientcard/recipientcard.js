// components/recipientcard/recipientcard.js
Component({
  /**
   * Component properties
   */
  properties: {
    recipientName:{
      type: String,
      value: ''
    },
    recipientGrade: {
      type: Number,
      value: 9
    },
    recipientClass: {
      type: Number,
      value: 1
    },
    quantity:{
      type: Number,
      value: 1
    },
    recipientNumber:{
      type: Number,
    },
    removable: Boolean
  },

  /**
   * Component initial data
   */
  data: {
    name: "",
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',
  },

  /**
   * Component methods
   */
  methods: {
    onNameInput:function (e) {
      console.log(this.properties.recipientNumber)
      var myEventDetail = { 
        "id": this.properties.recipientNumber,
        "name": e.detail.value,
      }
      var myEventOption = {}
      this.triggerEvent('nameinput', myEventDetail, myEventOption)
    },
    onGradeChange: function (e) {
      const getGrade = this.data.arrayGrade[e.detail.value];
      this.setData({
        indexGrade: e.detail.value,
        studentGrade: getGrade
      })


      console.log(this.properties.recipientNumber)
      var myEventDetail = {
        "id": this.properties.recipientNumber,
        "grade": getGrade,
      }
      var myEventOption = {}
      this.triggerEvent('gradechange', myEventDetail, myEventOption)
    },

    onClassChange: function (e) {
      const getClass = this.data.arrayClass[e.detail.value];
      this.setData({
        indexClass: e.detail.value,
        studentClass: getClass
      })

      console.log(this.properties.recipientNumber)
      var myEventDetail = {
        "id": this.properties.recipientNumber,
        "classnum": getClass, //variable name, class is already occupied
      }
      var myEventOption = {}
      this.triggerEvent('classchange', myEventDetail, myEventOption)
    },

    onQuantityInput: function (e) {
      var myEventDetail = {
        "id": this.properties.recipientNumber,
        "quantity": e.detail.value,
      }
      var myEventOption = {}
      this.triggerEvent('inputquantity', myEventDetail, myEventOption)
    },

    onDelete: function () {
      console.log(this.properties.recipientNumber)
      var myEventDetail = {
        "id": this.properties.recipientNumber,
      }
      var myEventOption = {}
      this.triggerEvent('ondelete', myEventDetail, myEventDetail)
    }
  }
})
