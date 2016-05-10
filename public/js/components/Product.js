import React from 'react'
import {Link} from 'react-router'
import ProductModel from '../models/ProductModel'

let socket = null

class Product extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      product: {
        id: undefined,
        name: "",
        code: ""
      },
      error: "",
      info: "",
      isScanning: false
    }
  }
  componentDidMount(){
    if (this.props.params.id) this.loadProduct(this.props.params.id)
    socket = io.connect('http://localhost:5000')
    socket.on('rfidreader_data', this.onSocketData.bind(this))
  }
  componentWillUnmount() {
    socket.disconnect()
    socket = null
  }
  loadProduct(pId){
    ProductModel.get(pId)
    .then(this.afterProductLoad.bind(this))
    .catch(this.onProductLoadError.bind(this))
  }
  afterProductLoad(response){
    this.setState({product: response.data})
  }
  onProductLoadError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  afterProductSubmit(){
    if (!this.state.product.id) this.setState({product: {id: undefined, name: "", code: ""}})
    this.setState({info: "The product was saved successfully."})
    setTimeout(()=> this.setState({info: ""})
      , 3000)
  }
  onProductSubmitError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  onSocketData(data) {
    if (!this.state.isScanning) return;
    this.state.product.code = data[0]
    this.setState({product: this.state.product})
  }
  handleNameChange(e) {
    this.state.product.name = e.target.value
    this.setState({product: this.state.product})
  }
  handleCodeChange(e) {
    this.state.product.code = e.target.value
    this.setState({product: this.state.product})
  }
  handleSubmit(e){
    e.preventDefault()
    ProductModel.save(this.state.product)
    .then(this.afterProductSubmit.bind(this))
    .catch(this.onProductSubmitError.bind(this))
  }
  onToggleScan(e){
    e.preventDefault()
    this.setState({isScanning: !this.state.isScanning})
  }
  render(){
    let title = this.state.product.id ? "Edit product " + this.state.product.name : "Add product";
    return (
      <div>
        <div className="page-header">
          <h1>{title}</h1>
        </div>
        <div className="alert alert-danger" role="alert" style={!this.state.error ? {'display':'none'} : {}}>{this.state.error}</div>
        <div className="alert alert-success" role="alert" style={!this.state.info ? {'display':'none'} : {}}>{this.state.info}</div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label for="name">Name</label>
            <input type="text" value={this.state.product.name} onChange={this.handleNameChange.bind(this)} className="form-control" placeholder="Name" />
          </div>
          <div className="form-group">
            <label for="name">Code</label>
            <div className="row">
              <div className="col-md-8 col-sm-8">
                <input type="text" value={this.state.product.code} className="form-control" placeholder="Code" />
              </div>
              <div className="col-md-4 col-sm-4">
                <button type="button" onClick={this.onToggleScan.bind(this)} className="btn btn-default btn-block">{this.state.isScanning ? "Stop" : "Scan"}</button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save</button> <Link className="btn btn-default" to={`/products`}>Back</Link>
        </form>
      </div>
    )
  } 
}

export default Product