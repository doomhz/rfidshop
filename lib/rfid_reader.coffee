SerialPort = require("serialport").SerialPort
_          = require "underscore"

# Tag example: ccffff1132010e0130396062439ad180000caccb23
# prefix: ccffff1132010e01 length: 16
# id: 30396062439ad180000caccb length: 24
# postfix: 23 length: 2
# total length: 42

INPUT_BUFFER_LIMIT = 10000

inputBuffer = ""
idRegExp = undefined
testSendInterval = undefined
testData = [
  "sadsadasdccffff1132010e0130396062439ad180000caccb23wadasdsadasdsadsadweqdadccffff1132010e0130396062439ad180000caccb23wewdsadasd"
  "dsdaddasccffff1132010e013039606246666666666caccb23sdasdasdasdccffff1132010e013039606246666666666caccb23sdasdsadsadasdsd"
  "aaaaaccffff1132010e013039606247777777777caccb23sdssfsdfccffff1132010e013039606247777777777caccb23dfdgfdgdfgccffff1132010e013039606247777777777caccb23"
  "sasaccffff1132010e013039606248888888888caccb23sdasdsaasdccffff1132010e013039606248888888888caccb23asdasdd"
  "sdadasccffff1132010e013039606249999999999caccb23sdasdsadsadccffff1132010e013039606249999999999caccb23asdsadasccffff1132010e013039606249999999999caccb23asdsadsadccffff1132010e013039606249999999999caccb23asdsad"
]

class RFIDReader

  socket: null

  port: "/dev/tty-usbserial1"

  baudRate: 9600

  dataBits: 8

  bufferSize: 65536

  dataPrefix: "ccffff1132010e01"

  dataPostfix: "23"

  dataFilter: "ids"

  dataFilterCallbackName: null

  testMode: false

  testSendTime: 1000

  readingInProgress: false

  constructor: (opts)->
    @port = opts.port if opts.port
    @baudRate = opts.baudRate if opts.baudRate?
    @dataBits = opts.dataBits if opts.dataBits?
    @bufferSize = opts.bufferSize if opts.bufferSize?
    @dataFilter = opts.dataFilter if opts.dataFilter?
    @testMode = opts.testMode if opts.testMode?
    @testSendTime = opts.testSendTime if opts.testSendTime?
    @onOpen = opts.onOpen if opts.onOpen
    @onRead = opts.onRead if opts.onRead
    @onError = opts.onError if opts.onError
    @onDisconnect = opts.onDisconnect if opts.onDisconnect    

  getDeviceOptions: ->
    baudRate: @baudRate
    dataBits: @dataBits
    bufferSize: @bufferSize

  setupDataFilter: ->
    if @dataFilter is "ids"
      idRegExp = new RegExp "#{@dataPrefix}([a-b0-9]).{0,24}#{@dataPostfix}", "g"
      @dataFilterCallbackName = "onReadIDs"
    else if @dataFilter is "hex"
      @dataFilterCallbackName = "onReadAllHex"
    else if @dataFilter is "ascii"
      @dataFilterCallbackName = "onReadAllAscii"
    else
      @dataFilterCallbackName = "onReadAllRaw"

  start: (callback = ->)->
    try
      if not @socket
        @setupDataFilter()
        @socket = new SerialPort @port, @getDeviceOptions(), false
        @socket.on "open", @onOpen
        @socket.on "error", @onError
        @socket.on "disconnect", @onDisconnect
        @socket.on "data", @[@dataFilterCallbackName]
      if not @testMode
        if not @socket.isOpen()
          @socket.open callback
        else
          callback()
      else
        if @testSendTime
          testSendInterval = setInterval =>
              @[@dataFilterCallbackName] _.sample testData
            , @testSendTime
        callback()
      @readingInProgress = true
    catch e
      callback e
      @readingInProgress = false

  stop: (callback = ->)->
    clearInterval testSendInterval  if testSendInterval
    @socket.close callback
    @readingInProgress = false

  isStarted: ->
    @readingInProgress

  onReadAllRaw: (data)=>
    @onRead data.toString()

  onReadAllHex: (data)=>
    @onRead data.toString("hex")

  onReadAllAscii: (data)=>
    @onRead data.toString("ascii")

  onReadIDs: (data)=>
    inputBuffer += data.toString("hex")
    ids = @findBufferIds()
    if ids
      inputBuffer = inputBuffer.replace idRegExp, ""
      @onRead ids
    @clearBuffer()

  findBufferIds: ->
    _.map _.uniq inputBuffer.match idRegExp, (id)->
      _.rtrim _.ltrim(id, @dataPrefix), @dataPostfix

  clearBuffer: ()->
    inputBuffer.substr -INPUT_BUFFER_LIMIT  if inputBuffer.length > INPUT_BUFFER_LIMIT

exports = module.exports = RFIDReader