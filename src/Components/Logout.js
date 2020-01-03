import React from 'react'
import {firebaseContext} from '../Context/firebaseContext';

class Logout extends React.Component{
    static contextType = firebaseContext;
    render(){
        const logout = () => this.context.logout();
        return <button onClick={logout}>Logout</button>
    }
}

export default Logout;