import React from 'react'
import {Link, IndexLink} from 'react-router'

class Main extends React.Component {
  render(){
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container">
            <div className="navbar-header">
              <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" className="navbar-toggle collapsed"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button><IndexLink to="/" activeClassName="active" className="navbar-brand">RFID Shop</IndexLink>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li><Link to="/products" activeClassName="active">Products</Link></li>
                <li><Link to="/reader" activeClassName="active">Reader</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container theme-showcase" role="main">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Main