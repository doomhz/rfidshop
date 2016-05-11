_ = require "underscore"

products = [
  {id: 1, name: "Bacon", code: "10396062439ad180000caccb", status: "available"}
  {id: 2, name: "Ham", code: "20396062439ad180000caccb", status: "available"}
  {id: 3, name: "Cola", code: "30396062439ad180000caccb", status: "available"}
  {id: 4, name: "Fanta", code: "40396062439ad180000caccb", status: "available"}
  {id: 5, name: "Chips", code: "50396062439ad180000caccb", status: "sold"}
]

module.exports = (app)->

  app.get "/product*", (req, res, next)->
    return next()  if /application\/json/.test(req.get('accept'))
    res.render "site/index"

  app.get "/products/available/:code", (req, res)->
    code = req.params.code
    existentProduct = _.find products, (p)->
      (p.code is code) and (p.status is "available")
    return res.status(409).json {error: "Product doesn't exist."}  if not existentProduct
    res.json existentProduct

  app.get "/products/:page/:count", (req, res)->
    page = parseInt req.params.page
    count = parseInt req.params.count
    totalPages = Math.ceil products.length / count
    startPageIndex = if page is 1 then 0 else (page - 1) * count
    endPageIndex = startPageIndex + count
    res.json
      total: products.length
      products: products.slice startPageIndex, endPageIndex

  app.get "/products/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong product id."}  if not _.isNumber id
    existentProduct = _.find products, (p)->
      p.id is id
    return res.status(409).json {error: "Product doesn't exist."}  if not existentProduct
    res.json existentProduct

  app.post "/products", (req, res)->
    name = req.body.name
    code = req.body.code
    existentProduct = _.find products, (p)->
      p.code is code
    return res.status(409).json {error: "This product code already exists."}  if existentProduct
    product = 
      id: ++_.last(products).id
      name: name
      code: code
      status: "available"
    products.push product
    res.json product
  
  app.put "/products/:id", (req, res)->
    id = parseInt req.params.id
    name = req.body.name
    code = req.body.code
    return resstatus(409).json {error: "Wrong product id."}  if not _.isNumber id
    existentProduct = _.find products, (p)->
      p.id is id
    return resstatus(409).json {error: "Product doesn't exist."}  if not existentProduct
    existentProduct.name = name
    existentProduct.code = code
    res.json existentProduct

  app.delete "/products/:id", (req, res)->
    id = parseInt req.params.id
    return resstatus(409).json {error: "Wrong product id."}  if not _.isNumber id
    products = _.reject products, (p)->
      p.id is id
    res.json {}
