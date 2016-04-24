SerialPort = require('serialport').SerialPort
_                       = require "underscore"

# Tag example: ccffff1132010e0130396062439ad180000caccb23
# prefix: ccffff1132010e01 length: 16
# id: 30396062439ad180000caccb length: 24
# postfix: 23 length: 2
# total length: 42

INPUT_BUFFER_LIMIT = 10000

inputBuffer = ""
idRegExp = undefined

class RFIDReader

  socket: null

  port: "/dev/tty-usbserial1"

  baudRate: 9600

  dataBits: 8

  bufferSize: 65536

  dataPrefix: "ccffff1132010e01"

  dataPostfix: "23"

  dataFilter: "ids"

  constructor: (opts)->
    @port = opts.port if opts.port
    @baudRate = opts.baudRate if opts.baudRate?
    @dataBits = opts.dataBits if opts.dataBits?
    @bufferSize = opts.bufferSize if opts.bufferSize?
    @dataFilter = opts.dataFilter if opts.dataFilter?
    @onOpen = opts.onOpen if opts.onOpen
    @onRead = opts.onRead if opts.onRead
    @onError = opts.onError if opts.onError
    @onDisconnect = opts.onDisconnect if opts.onDisconnect
    idRegExp = new RegExp "#{@dataPrefix}([a-b0-9]).{0,24}#{@dataPostfix}", "g"

  getDeviceOptions: ->
    baudRate: @baudRate
    dataBits: @dataBits
    bufferSize: @bufferSize

  start: (callback = ->)->
    try
      if not @socket
        @socket = new SerialPort @port, @getDeviceOptions(), false
        @socket.on "open", @onOpen
        @socket.on "error", @onError
        @socket.on "disconnect", @onDisconnect
        if @dataFilter is "ids"
          @socket.on "data", @onReadIDs
        else if @dataFilter is "hex"
          @socket.on "data", @onReadAllHex
        else if @dataFilter is "ascii"
          @socket.on "data", @onReadAllAscii
        else
          @socket.on "data", @onReadAllRaw
      @socket.open()  if not @socket.isOpen()
    catch e
      callback e

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
    _.uniq inputBuffer.match idRegExp

  clearBuffer: ()->
    inputBuffer.substr -INPUT_BUFFER_LIMIT  if inputBuffer.length > INPUT_BUFFER_LIMIT

exports = module.exports = RFIDReader