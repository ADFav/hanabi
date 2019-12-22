import CardOptions from './CardOptions';
import React from 'react';

class MyCardOptions extends CardOptions {
    constructor(props){
        super(props);
        // console.log(this.props);
    }
    render() {
        return (<div style={this.style}>
            <button>Play</button>
            <button onClick={this.props.discard}>Discard</button>
        </div>)
    }
}

export default MyCardOptions;