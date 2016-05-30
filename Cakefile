require("coffee-script").register()

require "date-utils"
GLOBAL.appConfig = require "./config/config"
GLOBAL.db        = require "./models/index"

task "db:create_tables", "Create all tables", ()->
  GLOBAL.db.sequelize.sync()
  .then ()->
    console.log "Database sync complete."
  .error (err)->
    console.error err
