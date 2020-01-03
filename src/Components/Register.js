import React from 'react';
import { firebaseContext } from '../Context/firebaseContext';

class Register extends React.Component {
    static contextType = firebaseContext
    
    setEmail(event){
        const email = event.target.value;
        this.setState({email});
    }

    setPassword(event) {
        const password = event.target.value;
        this.setState({ password });
    }

    setUserName(event) {
        const userName = event.target.value;
        this.setState({ userName });
    }

    register(){
        const {email, password, userName} = this.state;
        this.context.signUpWithEmail(email, password, userName);
    }

    render(){
        return (
        <div>
            <strong>Email</strong>
            <input type="email" onChange={e => this.setEmail(e)} /><br/>
            <strong>Password</strong>
            <input type="password" onChange={e => this.setPassword(e)} /> <br />
            <strong>userName</strong>
            <input type="text" onChange={e => this.setUserName(e)} /> <br />
            <button onClick={() => this.register()}>Register</button>
        </div>
        )
    }
}

export default Register;