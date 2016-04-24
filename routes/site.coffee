AppHelper = require "../lib/app_helper"

module.exports = (app)->

  app.get "/", (req, res)->
    res.render "site/index"
