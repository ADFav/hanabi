import React from 'react';

class CardOptions extends React.Component {
    render() {
        return (<div style={this.style}>
            <button disabled={!this.props.canTell || this.props.color} onClick={this.props.tellColor}>Tell Color</button>
            <button disabled={!this.props.canTell || this.props.number} onClick={this.props.tellNumber}>Tell Number</button>
        </div>)
    }

    get style(){
        return {
            display :this.props.showOptions ? 'grid' : 'none',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.25)'
        };
    }
}

export default CardOptions;