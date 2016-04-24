RFIDReader = require "../lib/rfid_reader"

module.exports = (app)->

  app.get "/reader", (req, res)->
    res.render "reader/index"

  rfidReader = new RFIDReader
    port: "/dev/tty.usbserial-FT94MJKZ"
    dataFilter: "ids"
    testMode: true
    # testSendTime: false
    onOpen: (error)->
      return console.error "Can't open RFID port", error  if error
      console.log "RFID Device is reading data"
    onRead: (data)->
      console.log data.toString("hex")
    onError: (error)->
      console.error "RFID Device error:", error  if error
    onDisconnect: (error)->
      return console.error "Error disconnecting RFID device", error  if error
      console.log "RFID Device disconnected"
  
  rfidReader.start (error)->
    console.error "Can't start RFID device", error  if error

  setTimeout ->
      rfidReader.stop()
    , 10000