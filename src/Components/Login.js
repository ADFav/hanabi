import React from "react";
import { firebaseContext } from '../Context/firebaseContext';
import { Link } from 'react-router-dom';


class Login extends React.Component {
  static contextType = firebaseContext;
  componentDidMount() {
    console.log(this.context.auth.currentUser);
    this.context.registerAuthListener(changeState => {
      console.log(changeState);
    });
  }

  setEmail(event) {
    const email = event.target.value;
    this.setState({ email })
  }

  setPassword(event) {
    const password = event.target.value;
    this.setState({ password });
  }

  loginWithEmailAndPassword() {
    if(this.state){
      const { email, password } = this.state;
      this.context.loginWithEmail(email, password);
    }
  }
  render() {
    return <div>
      <strong>Email</strong>
      <input type="email" onChange={e => this.setEmail(e)} /><br />
      <strong>Password</strong>
      <input type="password" onChange={e => this.setPassword(e)} /><br />
      <button onClick={() => this.loginWithEmailAndPassword()}>Login</button><br />
      <Link to="/register">Create an account</Link>
    </div>
  }
}

export default Login;