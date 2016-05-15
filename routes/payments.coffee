_ = require "underscore"

payments = [
  {id: 1, products: [], status: "paid"}
]

module.exports = (app)->

  app.get "/payments/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong payment id."}  if not _.isNumber id
    existentPayment = _.find payments, (p)->
      p.id is id
    return res.status(409).json {error: "Payment doesn't exist."}  if not existentPayment
    res.json existentPayment

  app.post "/payments", (req, res)->
    products = req.body.products
    lastId = _.last(payments).id
    payment = 
      id: ++lastId
      products: products
      status: "pending"
    payments.push payment
    res.json payment
  
  app.put "/payments/:id", (req, res)->
    id = parseInt req.params.id
    fullName = req.body.full_name
    cardNumber = req.body.card_number
    products = req.body.products
    status = req.body.status
    return res.status(409).json {error: "Wrong payment id."}  if not _.isNumber id
    existentPayment = _.find payments, (p)->
      p.id is id
    return resstatus(409).json {error: "Payment doesn't exist."}  if not existentPayment
    existentPayment.full_name = fullName
    existentPayment.card_number = cardNumber
    existentPayment.products = products
    existentPayment.status = status
    res.json existentPayment

  app.delete "/payments/:id", (req, res)->
    id = parseInt req.params.id
    return resstatus(409).json {error: "Wrong payment id."}  if not _.isNumber id
    payments = _.reject payments, (p)->
      p.id is id
    res.json {}
