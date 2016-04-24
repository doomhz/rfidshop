RFIDReader = require "../lib/rfid_reader"

module.exports = (app)->

  app.get "/reader", (req, res)->
    res.render "reader/index"

  rfidReader = new RFIDReader
    port: "/dev/tty.usbserial-FT94MJKZ"
    dataFilter: "ids"
    onOpen: (error)->
      console.error error  if error
      console.log "RFID Device is reading data"
    onRead: (data)->
      console.log data.toString("hex")
    onError: (error)->
      console.error error  if error
    onDisconnect: (error)->
      console.error error  if error
      console.log "RFID Device disconnected"
    
  rfidReader.start (err)->
    console.error err