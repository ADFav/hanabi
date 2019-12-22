import React from "react";
import CardOptions from "./CardOptions";

// import template from "./Card.jsx";

/*Props:
  suit - the color of the card
  number - the number of the card
  knowldege:
    color - boolean if knowledge is known
    number - boolean if number is known
*/

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showOptions: false };
  }

  render() {
    return (<div style={this.styles} onClick={this.toggleOptions}>
      <h1>{this.number}</h1>
      {this.cardOptions()}
    </div>);
  }

  toggleOptions = () => {
    this.setState({ showOptions: !this.state.showOptions });
  }

  cardOptions = () => <CardOptions
    {...this.props.knowledge}
    canTell = {this.props.canTell}
    showOptions={this.state.showOptions}
    tellColor={this.props.tellColor}
    tellNumber={this.props.tellNumber} />

  tellColor() {
    this.props.tellColor()
  }

  backgroundColor() {
    switch (this.props.color) {
      case 'red':
        return '#C55';
      case 'blue':
        return '#55C';
      case 'green':
        return '#5C5';
      case 'yellow':
        return '#CC5';
      case 'white':
        return '#FFF';
      default:
        return '#000';
    }
  }

  get styles() {
    return {
      backgroundColor: this.backgroundColor(),
      // width: '150px',
      height: '100px',
      border: '3px solid black',
      borderRadius: '10px',
      display: "inline-block",
      textAlign: "center",
      position: 'relative'
    };
  }

  get number() {
    return this.props.number;
  }
}

export default Card;
