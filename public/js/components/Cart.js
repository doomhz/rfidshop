import React from 'react'
import {Link, browserHistory} from 'react-router'
import ProductModel from '../models/ProductModel'
import PaymentModel from '../models/PaymentModel'

let socket = null

class Cart extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      products: [],
      error: "",
      info: "",
      isScanning: false,
      total: 0
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
    this.calculateTotal()
  }
  onAvailableProductError(){
  }
  calculateTotal(){
    let total = 0;
    this.state.products.forEach((p)=> total += p.price)
    this.setState({total: total})
  }
  onStartScan(e){
    e.preventDefault()
    this.setState({isScanning: true})
    setTimeout(()=> this.setState({canPay: true})
      , 1000)
  }
  afterPaymentSubmit(result){
    browserHistory.push(`pay/${result.data.id}`)
  }
  onPaymentSubmitError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  onPay(e){
    e.preventDefault()
    PaymentModel.save({products: this.state.products})
    .then(this.afterPaymentSubmit.bind(this))
    .catch(this.onPaymentSubmitError.bind(this))
  }
  render(){
    return (
      <div>
        <div className="alert alert-danger" role="alert" style={!this.state.error ? {'display':'none'} : {}}>{this.state.error}</div>
        <div className="alert alert-success" role="alert" style={!this.state.info ? {'display':'none'} : {}}>{this.state.info}</div>
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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.code}</td>
                <td>{product.price} EUR</td>
              </tr>
            ))}
            <tr key="total">
              <td><b>Total</b></td>
              <td></td>
              <td><b>{this.state.total} EUR</b></td>
            </tr>
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