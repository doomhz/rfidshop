import React from 'react'
import {Link} from 'react-router'
import ProductModel from '../models/ProductModel'

let socket = null

class Cart extends React.Component {
  constructor(){
    super()
    this.state = {
      products: [],
      error: "",
      info: "",
      isScanning: false
    }
  }
  componentDidMount(){
    socket = io.connect('http://localhost:5000')
    socket.on('rfidreader_data', this.onSocketData.bind(this))
  }
  componentWillUnmount() {
    socket.disconnect()
    socket = null
  }
  onSocketData(data) {
    if (!this.state.isScanning) return;
    this.addProduct(data[0])
  }
  addProduct(pCode){
    ProductModel.getAvailableByCode(pCode)
    .then(this.onAvailableProduct.bind(this))
    .catch(this.onAvailableProductError.bind(this))
  }
  getProduct(code){
    return this.state.products.filter((p)=> p.code === code)[0]
  }
  onAvailableProduct(data){
    if (this.getProduct(data.data.code)) return;
    this.state.products.push(data.data)
    this.setState({products: this.state.products})
  }
  onAvailableProductError(){
  }
  onStartScan(e){
    e.preventDefault()
    this.setState({isScanning: true})
    setTimeout(()=> this.setState({canPay: true})
      , 1000)
  }
  onPay(e){
    e.preventDefault()
    this.setState({isScanning: false})
  }
  render(){
    return (
      <div>
        <div className="alert alert-info" role="alert" style={this.state.isScanning ? {'display':'none'} : {}}>
          Please, place your products on the scanner and then press the SCAN button bellow.
        </div>
        <div className="row" style={this.state.isScanning ? {'display':'none'} : {}}>
          <button type="button" onClick={this.onStartScan.bind(this)} className="btn btn-primary btn-block">Scan</button>
        </div>
        <div className="page-header">
          <h2>My products</h2>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <button type="button" onClick={this.onPay.bind(this)} className="btn btn-success btn-block" style={!this.state.canPay ? {'display':'none'} : {}}>Confirm and pay</button>
        </div>
      </div>
    )
  } 
}

export default Cart