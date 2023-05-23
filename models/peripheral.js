const mongoose = require('mongoose')

const PeripheralSchema = new mongoose.Schema({
  uid: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  vendor: {
    type: String,
    default: '',
    required: true,
  },
  dateCreated: {
    type: String,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    required: true,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  _createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

exports.PeripheralModel = mongoose.model('Peripheral', PeripheralSchema)
