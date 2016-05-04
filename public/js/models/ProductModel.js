import axios from 'axios'

class ProductModel {
  static save(attrs){
    return axios.post("products")
  }
}

export default ProductModel