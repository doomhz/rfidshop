import React from 'react'
import {Link} from 'react-router'
import {Pagination} from 'elemental'
import ProductModel from '../models/ProductModel'

class Products extends React.Component {
  constructor(){
    super()
    this.state = {
      products: [],
      currentPage: 1,
      pageSize: 10,
      plural: "products",
      singular: "product",
      total: 0,
      limit: 10,
      error: "",
      info: ""
    }
  }
  componentDidMount(){
    this.loadProducts()
  }
  loadProducts(){
    ProductModel.getAll(this.state.currentPage, this.state.pageSize)
    .then(this.afterProductsLoad.bind(this))
    .catch(this.onProductsLoadError.bind(this))
  }
  afterProductsLoad(response){
    this.setState({
      products: response.data.products,
      total: response.data.total
    })
  }
  onProductsLoadError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  afterProductDelete(response){
    this.setState({info: "Product deleted successfully."})
    setTimeout(()=> this.setState({info: ""})
      , 3000)
    this.loadProducts()
  }
  onProductDeleteError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  handleDelete(pId){
    if (confirm("Are you sure?")) {
      ProductModel.delete(pId)
      .then(this.afterProductDelete.bind(this))
      .catch(this.onProductDeleteError.bind(this))
    }
  }
  handlePageSelect(page){
    this.state.currentPage = page
    this.loadProducts()
  }
  render(){
    return (
      <div>
        <div className="page-header">
          <h1>Products <Link className="btn btn-primary" to="/add-product">+ New product</Link></h1>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.code}</td>
                <td>{product.status}</td>
                <td>
                  <Link className="btn btn-default" to={`/edit-product/${product.id}`}>Edit</Link><span> </span>
                  <button className="btn btn-danger" onClick={() => this.handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={this.state.currentPage}
          onPageSelect={this.handlePageSelect.bind(this)}
          pageSize={this.state.pageSize}
          plural={this.state.plural}
          singular={this.state.singular}
          total={this.state.total}
          limit={this.state.limit}
        />
      </div>
    )
  } 
}

export default Products