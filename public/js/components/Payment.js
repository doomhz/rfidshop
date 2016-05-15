import React from 'react'
import {Link, browserHistory} from 'react-router'
import PaymentModel from '../models/PaymentModel'

class Payment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      payment: {},
      error: "",
      info: ""
    }
  }
  componentDidMount(){
    this.state.payment.id = this.props.params.id
    this.loadPayment()
  }
  componentWillUnmount() {
  }
  loadPayment(){
    PaymentModel.get(this.state.payment.id)
    .then(this.afterPaymentLoad.bind(this))
    .catch(this.onPaymentLoadError.bind(this))
  }
  afterPaymentLoad(response){
    this.setState({payment: response.data})
  }
  onPaymentLoadError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  afterPaymentSubmit(){
    this.setState({info: "Thank you for your purchase. Have a great day!"})
    setTimeout(()=> browserHistory.push("/cart")
      , 3000)
  }
  onPaymentSubmitError(response){
    this.setState({error: response.data.error})
    setTimeout(()=> this.setState({error: ""})
      , 3000)
  }
  handleNameChange(e) {
    this.state.payment.full_name = e.target.value
    this.setState({payment: this.state.payment})
  }
  handleCardNumberChange(e) {
    this.state.payment.card_number = e.target.value
    this.setState({payment: this.state.payment})
  }
  handleSubmit(e){
    e.preventDefault()
    this.state.payment.status = "paid"
    this.setState({payment: this.state.payment})
    PaymentModel.save(this.state.payment)
    .then(this.afterPaymentSubmit.bind(this))
    .catch(this.onPaymentSubmitError.bind(this))
  }
  render(){
    return (
      <div>
        <div className="page-header">
          <h1>Almost done!</h1>
        </div>
        <div className="alert alert-danger" role="alert" style={!this.state.error ? {'display':'none'} : {}}>{this.state.error}</div>
        <div className="alert alert-success" role="alert" style={!this.state.info ? {'display':'none'} : {}}>{this.state.info}</div>
        <form onSubmit={this.handleSubmit.bind(this)} style={this.state.payment.status === "paid" ? {'display':'none'} : {}}>
          <p>Please fill in your credit card data bellow.</p>
          <div className="form-group">
            <label for="name">Full Name</label>
            <input type="text" value={this.state.payment.full_name} onChange={this.handleNameChange.bind(this)} className="form-control" placeholder="Full name" />
          </div>
          <div className="form-group">
            <label for="name">Card number</label>
            <input type="text" value={this.state.payment.card_number} onChange={this.handleCardNumberChange.bind(this)} className="form-control" placeholder="Card number" />
          </div>
          <button type="submit" className="btn btn-success btn-block">Pay</button>
        </form>
      </div>
    )
  } 
}

export default Payment