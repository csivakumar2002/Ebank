import {Component} from 'react'
import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    pin: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showSubmitError: true,
      errorMsg,
    })
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  renderPinField = () => {
    const {pin} = this.state
    return (
      <>
        <label className="input-label" htmlFor="pin">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          className="password-input-filed"
          value={pin}
          placeholder="Enter PIN"
          onChange={this.onChangePin}
        />
      </>
    )
  }

  renderUserIdField = () => {
    const {userId} = this.state
    return (
      <>
        <label className="input-label" htmlFor="userId">
          User ID
        </label>
        <input
          type="text"
          id="userId"
          placeholder="Enter User ID"
          className="username-input-filed"
          value={userId}
          onChange={this.onChangeUserId}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <h1>Welcome Back</h1>
          <div className="input-container">{this.renderUserIdField()}</div>
          <div className="input-container">{this.renderPinField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
