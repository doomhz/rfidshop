AppHelper = require "../lib/app_helper"

module.exports = (app)->

  app.get "/reader", (req, res)->
    res.render "reader/index"
