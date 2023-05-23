const request = require('supertest')
const mongoose = require('mongoose')
const initMongo = require('./config/mongodb')
const app = require('./app')

let server;

const appListen = (listenPort) => new Promise(resolve => {
  server = app.listen(listenPort, () => {
    console.log(`App listening at http://localhost:${listenPort}`)
    resolve()
  })
})

beforeAll(async () => {
  await initMongo(`test-${Date.now()}`)
  await appListen(Math.floor(Math.random() * 10000 + 1024))
})

afterAll(async () => {
  await server.close()
  await mongoose.connection.close()
})

describe('healthcheck test', () => {
  it('should return all gateways', async () => {
    const res = await request(app).get('/api/healthcheck')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'Healthy!')
  })
})

describe('POST /api/gateway', () => {
  it('should create a gateway', async () => {
    const res = await request(app).post('/api/gateway').send({
      serialNumber: '12345',
      name: 'Test Gateway',
      ipv4: '172.20.43.11',
      peripherals: [],
    })
    console.log("🚀 ~ file: gateway.test.js:12 ~ res ~ res:", res)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('_id')
  })
})

describe('POST /api/gateway', () => {
  it('should return 400 error for invalid IPv4 address', async () => {
    const res = await request(app).post('/api/gateway').send({
      serialNumber: '482376487228736',
      name: 'Test Gateway',
      ipv4: '127.0.0.888',
      peripherals: [],
    })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('error', true)
    expect(res.body).toHaveProperty('message', 'Invalid IPv4 address')
  })
})

describe('GET /api/gateway', () => {
  it('should return all gateways', async () => {
    const res = await request(app).get('/api/gateway')

    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /api/gateway/:serialNumber', () => {
  it('should return a gateway with the given serialNumber', async () => {
    const serialNumber = '12345' // replace with an existing serialNumber
    const res = await request(app).get(`/api/gateway/${serialNumber}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('serialNumber', serialNumber)
  })

  it('should return 404 error if gateway with given serialNumber does not exist', async () => {
    const serialNumber = 'nonexistent'
    const res = await request(app).get(`/api/gateway/${serialNumber}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error', true)
    expect(res.body).toHaveProperty(
      'message',
      `Gateway not found serialNumber: ${serialNumber}`,
    )
  })
})
