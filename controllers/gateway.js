const { GatewayModel } = require('../models/gateway')
const { PeripheralModel } = require('../models/peripheral')
const { validateIpv4Address, patchRecord } = require('../utils')

exports.create = async (req, res) => {
  const { serialNumber, name, ipv4, peripherals } = req.body

  if (!validateIpv4Address(ipv4)) {
    res.status(400).json({
      message: 'Invalid IPv4 address',
      error: true,
    })
    return
  }

  if (peripherals.length > 10) {
    res.status(400).json({
      message: 'Max allowed peripherals per gateway: 10',
      error: true,
    })
    return
  }

  const gateway = new GatewayModel({
    serialNumber,
    name,
    ipv4,
    peripherals,
  })
  try {
    await gateway.save()
    res.status(200).json({
      ...gateway.toObject(),
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
    // console.log(GatewayModel)
    const gateways = await GatewayModel.find().populate('peripherals')
    res.status(200).json(gateways)
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.findOne = async (req, res) => {
  try {
    const { serialNumber } = req.params
    const gateway = await GatewayModel.findOne({
      serialNumber,
    }).populate('peripherals')
    if (gateway) {
      res.status(200).json(gateway)
    } else {
      res.status(404).json({
        message: `Gateway not found serialNumber: ${serialNumber}`,
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
  try {
    const { serialNumber } = req.params
    const { name, ipv4, peripherals } = req.body
    if (!validateIpv4Address(ipv4)) {
      res.status(400).json({
        message: 'Invalid IPv4 address',
        error: true,
      })
      return
    }
    // TODO refactor validations
    if (peripherals.length > 10) {
      res.status(400).json({
        message: 'Max allowed peripherals per gateway: 10',
        error: true,
      })
      return
    }

    const gateway = await GatewayModel.findOne({ serialNumber })
    if (gateway) {
      patchRecord(gateway, { name, ipv4, peripherals })
      await gateway.save()

      res.status(200).json({
        ...gateway.toObject(),
      })
    } else {
      res.status(404).json({
        message: `Gateway not found. Serial number: ${serialNumber}`,
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
  const { serialNumber } = req.params
  try {
    const gateway = await GatewayModel.findOne({ serialNumber })
    if (gateway) {
      await gateway.deleteOne()
      res.status(200).json({
        ...gateway.toObject(),
      })
    } else {
      res.status(404).json({
        message: `Gateway not found with serialNumber: ${serialNumber}`,
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

exports.detachPeripheral = async (req, res) => {
  const { serialNumber } = req.params
  const { peripheralUid } = req.body
  try {
    const gateway = await GatewayModel.find({
      serialNumber,
    }).populate('peripherals')

    if (!gateway) {
      res.status(404).json({
        message: `Gateway not found with serialNumber ${serialNumber}`,
        error: true,
      })
      return
    }

    const lenBefore = gateway.peripherals.length
    gateway.peripherals = gateway.peripherals.filter(
      (p) => p.uid !== peripheralUid,
    )
    const lenAfter = gateway.peripherals.length
    if (lenBefore === lenAfter) {
      res.status(404).json({
        message: `Peripheral not found uid: ${peripheralUid}`,
        error: true,
      })
      return
    }
    await gateway.save()
    res.status(200).json({
      ...gateway.toObject(),
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}

exports.attachPeripheral = async (req, res) => {
  const { serialNumber } = req.params
  console.log(
    '🚀 ~ file: gateway.js:180 ~ exports.attachPeripheral= ~ serialNumber:',
    serialNumber,
  )
  const { peripheralUid } = req.body
  console.log(
    '🚀 ~ file: gateway.js:182 ~ exports.attachPeripheral= ~ peripheralUid:',
    peripheralUid,
  )
  try {
    const peripheral = await PeripheralModel.findOne({ uid: peripheralUid })
    if (!peripheral) {
      res.status(404).json({
        message: 'Peripheral not found',
        error: true,
      })
      return
    }

    const gateway = await GatewayModel.findOne({ serialNumber }).populate(
      'peripherals',
    )

    if (!gateway) {
      res.status(404).json({
        message: 'Gateway not found',
        error: true,
      })
      return
    }

    console.log(
      '🚀 ~ file: gateway.js:192 ~ exports.attachPeripheral= ~ gateway:',
      gateway,
    )

    if (gateway.peripherals.find((p) => p.uid === peripheralUid)) {
      res.status(400).json({
        message: `Gateway ${serialNumber} already is attached to this peripheral`,
        error: true,
      })
      return
    }

    if (gateway.peripherals.length >= 10) {
      res.status(400).json({
        message: 'Max allowed peripherals per gateway: 10',
        error: true,
      })
      return
    }

    gateway.peripherals.push(peripheral)

    await gateway.save()
    res.status(200).json({
      ...gateway.toObject(),
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: true,
    })
  }
}
