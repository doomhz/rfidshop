import React from 'react'
import ProductModel from '../models/ProductModel'

class Product extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: "",
      code: ""
    }
  }
  handleNameChange(e) {
    this.setState({name: e.target.value})
  }
  handleCodeChange(e) {
    this.setState({code: e.target.value})
  }
  afterProductSubmit(){
    this.setState({name: "", code: ""})
  }
  onProductSubmitError(){
  }
  handleSubmit(e){
    e.preventDefault()
    ProductModel.save(this.state)
    .then(this.afterProductSubmit.bind(this))
    .catch(this.onProductSubmitError.bind(this))
  }
  render(){
    let title = this.state.id ? "Edit product " + this.state.name : "Add product";
    return (
      <div>
        <div className="page-header">
          <h1>{title}</h1>
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label for="name">Name</label>
            <input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)} className="form-control" placeholder="Name" />
          </div>
          <div className="form-group">
            <label for="name">Code</label>
            <input type="text" value={this.state.code} onChange={this.handleCodeChange.bind(this)} className="form-control" placeholder="Code" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>
      </div>
    )
  } 
}

export default Product