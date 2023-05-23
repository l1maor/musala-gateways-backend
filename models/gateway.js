const mongoose = require('mongoose')

const GatewaySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  ipv4: {
    type: String,
    required: true,
    index: true,
  },
  peripherals: {
    type: [mongoose.Types.ObjectId],
    ref: 'Peripheral',
    default: [],
    required: true,
  },
})

exports.GatewayModel = mongoose.model('Gateway', GatewaySchema)
