import axios from 'axios'

class PaymentModel {
  static save(attrs){
    return axios[attrs.id ? "put" : "post"]("/payments" + (attrs.id ? `/${attrs.id}` : ""), attrs)
  }
  static get(pId){
    return axios.get(`/payments/${pId}`)
  }
  static delete(pId){
    return axios.delete(`/payments/${pId}`)
  }
}

export default PaymentModel