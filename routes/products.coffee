Product   = GLOBAL.db.Product
AppHelper = require "../lib/app_helper"
_         = require "underscore"

module.exports = (app)->

  app.get "/product*", (req, res, next)->
    return next()  if /application\/json/.test(req.get('accept'))
    res.render "site/index"

  app.get "/products/available/:code", (req, res)->
    code = req.params.code
    Product.findOne({where: {code: code, status: AppHelper.getProductStatusInt("available")}})
    .then (existentProduct)->
      return res.status(409).json {error: "Product doesn't exist."}  if not existentProduct
      res.json existentProduct

  app.get "/products/:page/:count", (req, res)->
    page = parseInt req.params.page
    count = parseInt req.params.count
    offset = (page - 1) * count
    Product.count()
    .then (totalProducts)->
      totalPages = Math.ceil totalProducts / count
      Product.findAll({offset: offset, limit: count})
      .then (products)->
        res.json
          total: totalProducts
          products: products

  app.get "/products/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong product id."}  if not _.isNumber id
    Product.findById(id)
    .then (existentProduct)->
      return res.status(409).json {error: "Product doesn't exist."}  if not existentProduct
      res.json existentProduct

  app.post "/products", (req, res)->
    name = req.body.name
    code = req.body.code
    Product.create({name: name, code: code})
    .then (product)->
      res.json product
    .error (e)->
      console.error e
      return res.status(409).json {error: "This product code already exists."}  if existentProduct    
  
  app.put "/products/:id", (req, res)->
    id = parseInt req.params.id
    name = req.body.name
    code = req.body.code
    return res.status(409).json {error: "Wrong product id."}  if not _.isNumber id
    Product.findOne({where: {code: code}})
    .then (existentProduct)->
      return res.status(409).json {error: "Product doesn't exist."}  if not existentProduct
      existentProduct.name = name
      existentProduct.code = code
      existentProduct.save().then (p)->
        res.json existentProduct

  app.delete "/products/:id", (req, res)->
    id = parseInt req.params.id
    return res.status(409).json {error: "Wrong product id."}  if not _.isNumber id
    Product.findById(id)
    .then (existentProduct)->
      return res.json {}  if not existentProduct
      existentProduct.destroy()
      .then ()->
        res.json {}
