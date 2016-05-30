_ = require "underscore"

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

exports = module.exports = AppHelper