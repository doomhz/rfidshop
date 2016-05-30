math = require "mathjs"
_    = require "underscore"

PRODUCT_STATUS =
  available: 1
  sold: 2

PAYMENT_STATUS =
  pending: 1
  paid: 2

AppHelper =

  getProductStatusInt: (status)->
    PRODUCT_STATUS[status]

  getProductStatusLiteral: (status)->
    _.invert(PRODUCT_STATUS)[status]

  getPaymentStatusInt: (status)->
    PAYMENT_STATUS[status]

  getPaymentStatusLiteral: (status)->
    _.invert(PAYMENT_STATUS)[status]

  toBignum: (value)->
    math.bignumber "#{value}"

  toBigint: (value)->
    parseInt math.multiply(@toBignum(value), @toBignum(100))

  fromBigint: (value)->
    parseFloat math.divide(@toBignum(value), @toBignum(100))


exports = module.exports = AppHelper