import React from 'react'
import ReactDOM from 'react-dom'

let socket = null

class RFIDReader extends React.Component {
  constructor(){
    super()
    this.state = {
    }
  }
  onData(data) {
    let now = new Date()
    let row = "<li>" + "<span class='label label-default'>[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "]</span> " + JSON.stringify(data) + "</li>"
    this.$console.innerHTML = row + ReactDOM.findDOMNode(this.refs.console).innerHTML
  }
  onInfo(info){
    this.$readerStatus.textContent = info.status
    if (info.port) this.$devicePort.value = info.port
    if (info.dataFilter) this.$dataFilter.value = info.dataFilter
    if (info.status === "stopped") {
      this.$toggleReadingBt.textContent = "Start reader"
      this.$toggleReadingBt.classList.remove("btn-warning")
      this.$readerStatus.classList.remove("label-success")
      this.$readerStatus.classList.add("label-default")
    }
    if (info.status === "reading") {
      this.$toggleReadingBt.textContent = "Stop reader"
      this.$toggleReadingBt.classList.add("btn-warning")
      this.$readerStatus.classList.remove("label-default")
      this.$readerStatus.classList.add("label-success")
    }
  }
  componentDidMount() {
    this.$console = ReactDOM.findDOMNode(this.refs.console)
    this.$readerStatus = ReactDOM.findDOMNode(this.refs.readerStatus)
    this.$devicePort = ReactDOM.findDOMNode(this.refs.devicePort)
    this.$dataFilter = ReactDOM.findDOMNode(this.refs.dataFilter)
    this.$toggleReadingBt = ReactDOM.findDOMNode(this.refs.toggleReadingBt)
    socket = io.connect('http://localhost:5000')
    socket.on('rfidreader_data', this.onData.bind(this))
    socket.on('rfidreader_info', this.onInfo.bind(this))
  }
  componentWillUnmount() {
    socket.disconnect()
    socket = null
  }
  toggleReading(){
    socket.emit('rfidreader_toggle', {port: this.$devicePort.value, dataFilter: this.$dataFilter.value})
  }
  render(){
    return (
      <div id="rfid-reader-log-wrapper">
        <div className="page-header">
          <h1>Reader</h1>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">Settings</div>
              <div className="panel-body">
                <div className="form-group">
                  <label>Status: <span ref="readerStatus" id="reader-status" className="label label-default"></span></label>
                </div>
                <div className="form-group">
                  <label>Device port:</label>
                  <input ref="devicePort" id="device-port" className="form-control"/>
                </div>
                <div className="form-group">
                  <label>Data filter: </label>
                  <select ref="dataFilter" id="data-filter" className="form-control">
                    <option value="ids">RFIDs</option>
                    <option value="hex">HEX data</option>
                    <option value="ascii">ASCII data</option>
                    <option value="raw">Raw data</option>
                  </select>
                </div>
                <div className="form-group">
                  <button ref="toggleReadingBt" onClick={this.toggleReading.bind(this)} id="toggle-reading-bt" className="btn btn-lg btn-default">Start/stop reader</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">Logs</div>
              <div className="panel-body">
                <ul ref="console" id="rfidreader-log"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RFIDReader