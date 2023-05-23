const { PeripheralModel } = require('../models/peripheral')
const { patchRecord } = require('../utils')

exports.create = async (req, res) => {
  const { uid, vendor, dateCreated, status } = req.body
  if (!['online', 'offline'].includes(status)) {
    res.status(400).json({
      message: 'Invalid peripheral status',
      error: true,
    })
    return
  }
  const peripheral = new PeripheralModel({
    uid,
    vendor,
    dateCreated,
    status,
  })
  try {
    await peripheral.save()
    res.status(200).json({
      ...peripheral.toObject(),
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.findAll = async (req, res) => {
  try {
    const peripherals = await PeripheralModel.find()
    res.status(200).json(peripherals)
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.findOne = async (req, res) => {
  try {
    const { uid } = req.params
    const peripheral = await PeripheralModel.findOne({ uid })
    if (peripheral) {
      res.status(200).json(peripheral)
    } else {
      res.status(404).json({
        message: `Peripheral not found. UID: ${uid}`,
        error: true,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.update = async (req, res) => {
  const { uid } = req.params
  const { uid: newUid, vendor, dateCreated, status } = req.body
  if (!['online', 'offline'].includes(status)) {
    res.status(400).json({
      message: `Invalid peripheral status ${status}`,
      error: true,
    })
    return
  }
  try {
    const peripheral = await PeripheralModel.findOne({ uid })

    if (peripheral) {
      patchRecord(peripheral, {
        uid: newUid,
        vendor,
        dateCreated,
        status,
      })

      await peripheral.save()
      res.status(200).json({
        ...peripheral.toObject(),
      })
    } else {
      res.status(404).json({
        message: `Peripheral not found. UID: ${uid}`,
        error: true,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.delete = async (req, res) => {
  try {
    const { uid } = req.params
    const peripheral = await PeripheralModel.findOne({ uid })
    if (peripheral) {
      await peripheral.deleteOne()
      res.status(200).json({
        ...peripheral.toObject(),
      })
    } else {
      res.status(404).json({
        message: 'Peripheral not found',
        error: true,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.findByGateway = async (req, res) => {
  try {
    const peripherals = await PeripheralModel.find({
      gateway: req.params.id,
    })
    res.status(200).json(peripherals)
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.countByGateway = async (req, res) => {
  try {
    const count = await PeripheralModel.countDocuments({
      gateway: req.params.id,
    })
    res.status(200).json({
      count,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}
