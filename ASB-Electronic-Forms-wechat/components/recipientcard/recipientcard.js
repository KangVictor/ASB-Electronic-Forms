// components/recipientcard/recipientcard.js
Component({
  /**
   * Component properties
   */
  properties: {
    recipientName:{
      type: String,
      value: 'John'
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
    removable: Boolean
  },

  /**
   * Component initial data
   */
  data: {
    arrayGrade: ['9', '10'],
    indexGrade: '0',
    arrayClass: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    indexClass: '0',
  },

  /**
   * Component methods
   */
  methods: {

  }
})
