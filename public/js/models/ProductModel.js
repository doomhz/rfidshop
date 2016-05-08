import axios from 'axios'

class ProductModel {
  static save(attrs){
    return axios[attrs.id ? "put" : "post"]("/products" + (attrs.id ? `/${attrs.id}` : ""), attrs)
  }
  static get(pId){
    return axios.get(`/products/${pId}`)
  }
  static getAll(page, limit){
    return axios.get(`/products/${page}/${limit}`)
  }
  static delete(pId){
    return axios.delete(`/products/${pId}`)
  }
}

export default ProductModel