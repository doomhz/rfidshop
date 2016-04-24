RFIDReader = require "./rfid_reader"

rfidReader = undefined

exports = module.exports = (server)->
  io = require('socket.io') server
  io.on 'connection', (socket) ->
    
    socket.emit "rfidreader_info",
      status: if rfidReader and rfidReader.isStarted() then "reading" else "stopped"
      port: rfidReader.port if rfidReader
      dataFilter: rfidReader.dataFilter if rfidReader
    
    socket.on 'rfidreader_toggle', (config)->
      if rfidReader and rfidReader.isStarted()
        rfidReader.stop()
        rfidReader = undefined
        io.emit "rfidreader_info", {status: "stopped"}
      else
        if not rfidReader
          rfidReader = new RFIDReader
            port: config.port
            dataFilter: config.dataFilter
            testMode: true
            # testSendTime: false
            onOpen: (error)->
              return console.error "Can't open RFID port", error  if error
              console.log "RFID Device is reading data"
            onRead: (data)->
              # console.log data
              GLOBAL.io.emit "rfidreader_data", data
            onError: (error)->
              console.error "RFID Device error:", error  if error
            onDisconnect: (error)->
              return console.error "Error disconnecting RFID device", error  if error
              console.log "RFID Device disconnected"
        rfidReader.start (error)->
          return console.error "Can't start RFID device", error  if error
          io.emit "rfidreader_info", {status: "reading"}
    
    return

  io