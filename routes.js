const PeripheralController = require('./controllers/peripheral')
const GatewayController = require('./controllers/gateway')

module.exports = (app) => {
  app.post('/api/peripheral', PeripheralController.create)
  app.get('/api/peripheral', PeripheralController.findAll)
  app.get('/api/peripheral/:uid', PeripheralController.findOne)
  app.patch('/api/peripheral/:uid', PeripheralController.update)
  app.delete('/api/peripheral/:uid', PeripheralController.delete)

  app.post('/api/gateway', GatewayController.create)
  app.get('/api/gateway', GatewayController.findAll)
  app.get('/api/gateway/:serialNumber', GatewayController.findOne)
  app.patch('/api/gateway/:serialNumber', GatewayController.update)
  app.delete('/api/gateway/:serialNumber', GatewayController.delete)

  app.post(
    '/api/gateway/attach_peripheral/:serialNumber',
    GatewayController.attachPeripheral,
  )
  app.delete(
    '/api/gateway/detach_peripheral/:serialNumber',
    GatewayController.detachPeripheral,
  )
}
