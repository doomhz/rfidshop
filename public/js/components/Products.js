import React from 'react'
import {Link} from 'react-router'
// import {Pagination} from 'elemental'

class Products extends React.Component {
  constructor(){
    super()
    this.state = {
      currentPage: 22,
      pageSize: 10,
      plural: "products",
      singular: "product",
      total: 1000,
      limit: 10
    }
  }
  handlePageSelect(){

  }
  render(){
    return (
      <div>
        <div className="page-header">
          <h1>Products <Link className="btn btn-primary" to="/add-product">+ New product</Link></h1>
        </div>
      </div>
    )
  } 
}

export default Products