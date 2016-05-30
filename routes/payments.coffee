Payment = GLOBAL.db.Payment
Product = GLOBAL.db.Product
_       = require "underscore"

module.exports = (app)->

  app.get "/payments/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong payment id."}  if not _.isNumber id
    Payment.findById(id)
    .then (existentPayment)->
      return res.status(409).json {error: "Payment doesn't exist."}  if not existentPayment
      res.json existentPayment

  app.post "/payments", (req, res)->
    products = _.map req.body.products, (p)->
      p.id
    Payment.create()
    .then (payment)->
      payment.addProducts(products)
      .then (payment)->
        payment.getProducts()
        .then (products)->
          _.each products, (p)->
            payment.total += p.price
          payment.save().then (payment)->
            res.json payment
  
  app.put "/payments/:id", (req, res)->
    id = parseInt req.params.id
    fullName = req.body.full_name
    cardNumber = req.body.card_number
    status = "paid"
    return res.status(409).json {error: "Wrong payment id."}  if not _.isNumber id
    Payment.findById(id)
    .then (existentPayment)->
      return res.status(409).json {error: "Payment doesn't exist."}  if not existentPayment
      existentPayment.full_name = fullName
      existentPayment.card_number = cardNumber
      existentPayment.status = status
      existentPayment.save()
      .then (existentPayment)->
        Product.update({status: "sold"}, {where: {payment_id: existentPayment.id}})
        .then ()->
          res.json existentPayment

  app.delete "/payments/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong payment id."}  if not _.isNumber id
    Payment.findById(id)
    .then (existentPayment)->
      return res.json {}  if not existentPayment
      existentPayment.destroy()
      .then ()->
        res.json {}
