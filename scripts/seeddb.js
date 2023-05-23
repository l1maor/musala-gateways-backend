const axios = require('axios')
const { PeripheralModel } = require('../models/peripheral')
const { port } = require('../config/env')

const SEDD_GATEWAYS_COUNT = 10 * 50
const SEED_PERIPHERALS_COUNT = 30 * 50

function range(start, stop, step = 1) {
  if (stop === undefined) {
    // eslint-disable-next-line no-param-reassign
    stop = start
    // eslint-disable-next-line no-param-reassign
    start = 0
  }
  const length = Math.max(Math.ceil((stop - start) / step), 0)
  return Array.from({ length }, (_, i) => start + i * step)
}

const generateGatewayRecord = (peripherals) => ({
  serialNumber: Math.floor(Math.random() * 10000000),
  name: `Gateway ${Math.floor(Math.random() * 200)}`,
  ipv4: `192.168.1.${Math.floor(Math.random() * 255)}`,
  peripherals,
})

const generatePeripheralRecord = () => ({
  uid: Math.floor(Math.random() * 10000000),
  vendor: `Vendor ${Math.floor(Math.random() * 200)}`,
  dateCreated: new Date(),
  status: Math.random() < 0.5 ? 'online' : 'offline',
})

const peripherals = {}

for (let i = 0; i < SEED_PERIPHERALS_COUNT; i += 1) {
  const uid = Math.floor(Math.random() * 10000000)
  peripherals[uid] = {
    ...generatePeripheralRecord(),
    uid,
  }
}

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const seed = async () => {
  const dbPeripherals = {}

  console.log('SEEDING: creating peripherals..')

  // eslint-disable-next-line no-restricted-syntax
  for (const peripheral of Object.values(peripherals)) {
    try {
      // pre test that a peripheral is stored in mongodb after calling the api
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(
        `http://localhost:${port}/api/peripheral`,
        peripheral,
      )
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data && response.data._id) {
        // eslint-disable-next-line no-await-in-loop
        const foundPeripheral = await PeripheralModel.findById(
          // eslint-disable-next-line no-underscore-dangle
          response.data._id,
        )
        if (!foundPeripheral) {
          console.error(
            `ERROR! seeding db with peripheral ${
              // eslint-disable-next-line no-underscore-dangle
              response.data._id
            } not found right after creation via HTTP API ${JSON.stringify(
              peripheral,
              null,
              2,
            )}`,
          )
          process.exit(1)
        }
        dbPeripherals[foundPeripheral.uid] = foundPeripheral
      } else {
        console.error(
          `ERROR! seeding db with data ${JSON.stringify(peripheral, null, 2)}`,
        )
        process.exit(1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const samplePeripheralsForNewGateway = () => {
    let result = [] // some gateways will have no perfipherals
    result = []
    // eslint-disable-next-line no-restricted-syntax
    for (const _ of range(Math.floor(Math.random() * 12))) {
      const chosenPeripheral =
        Object.values(dbPeripherals)[
          Math.floor(Math.random() * Object.keys(dbPeripherals).length)
        ]
      if (!result.find((p) => p.uid === chosenPeripheral.uid)) {
        // avoid duplicate peripherals for gateways
        result.push(chosenPeripheral)
      }
      // delete dbPeripherals[chosenPeripheral.uid]
    }
    return result
  }

  // await sleep(10000)

  console.log('SEEDING: creating gateways..')
  // eslint-disable-next-line no-restricted-syntax
  for (const i of range(SEDD_GATEWAYS_COUNT)) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const newRecord = generatePeripheralRecord()
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(
        `http://localhost:${port}/api/peripheral`,
        newRecord,
      )
      // eslint-disable-next-line no-underscore-dangle
      if (response && response.data && response.data._id) {
        console.log(`SEEDING: ${i} created gateway ${response.data.uid}`)
      } else {
        throw new Error(
          `SEEDING: error seeding db with data ${JSON.stringify(
            newRecord,
            null,
            2,
          )}`,
        )
      }
    } catch (err) {
      console.error(err)
    }

    console.log('SEEDING: creating gateways..')
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(`http://localhost:${port}/api/gateway`, {
        ...generateGatewayRecord(peripherals),
        peripherals: samplePeripheralsForNewGateway(),
      })
      // eslint-disable-next-line no-underscore-dangle
      if (response.data._id) {
        console.log(`SEEDING: created gateway ${response.data.serialNumber}`)
      }
      // console.log(response.data)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = seed
