import React from 'react'
import Main from '../components/Main'
import Home from '../components/Home'
import Products from '../components/Products'
import Product from '../components/Product'
import RFIDReader from '../components/RFIDReader'
import {Route} from 'react-router'
import {IndexRoute} from 'react-router'

export default (
  <Route path="/" component={Main}>
    <IndexRoute component={Home} />
    <Route path="/add-product" component={Product} />
    <Route path="/products" component={Products} />
    <Route path="/reader" component={RFIDReader} />
  </Route>
)