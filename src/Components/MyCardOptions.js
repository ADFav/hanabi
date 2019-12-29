import CardOptions from './CardOptions';
import React from 'react';

class MyCardOptions extends CardOptions {
    render() {
        return (<div style={this.style}>
            <button onClick={this.props.play}>Play</button>
            <button onClick={this.props.discard}>Discard</button>
        </div>)
    }
}

export default MyCardOptions;