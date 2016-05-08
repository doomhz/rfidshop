_ = require "underscore"

products = [
  {id: 1, name: "Bacon", code: "10396062439ad180000caccb"}
  {id: 2, name: "Ham", code: "20396062439ad180000caccb"}
  {id: 3, name: "Cola", code: "30396062439ad180000caccb"}
  {id: 4, name: "Fanta", code: "40396062439ad180000caccb"}
  {id: 5, name: "Chips", code: "50396062439ad180000caccb"}
]

module.exports = (app)->

  app.get "/product*", (req, res, next)->
    return next()  if /application\/json/.test(req.get('accept'))
    res.render "site/index"

  app.get "/products", (req, res)->
    res.json products

  app.get "/products/:id", (req, res)->
    id = parseInt req.params.id
    return res.json 409, {error: "Wrong product id."}  if not _.isNumber id
    existentProduct = _.find products, (p)->
      p.id is id
    return res.json 409, {error: "Product doesn't exist."}  if not existentProduct
    res.json existentProduct

  app.post "/products", (req, res)->
    name = req.body.name
    code = req.body.code
    existentProduct = _.find products, (p)->
      p.code is code
    return res.json 409, {error: "This product code already exists."}  if existentProduct
    product = 
      id: ++_.last(products).id
      name: name
      code: code
    products.push product
    res.json product
  
  app.put "/products/:id", (req, res)->
    id = parseInt req.params.id
    name = req.body.name
    code = req.body.code
    return res.json 409, {error: "Wrong product id."}  if not _.isNumber id
    existentProduct = _.find products, (p)->
      p.id is id
    return res.json 409, {error: "Product doesn't exist."}  if not existentProduct
    existentProduct.name = name
    existentProduct.code = code
    res.json existentProduct

  app.delete "/products/:id", (req, res)->
    id = parseInt req.params.id
    return res.json 409, {error: "Wrong product id."}  if not _.isNumber id
    products = _.reject products, (p)->
      p.id is id
    res.json {}
