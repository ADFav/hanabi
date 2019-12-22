import Card from './Card';
import MyCardOptions from './MyCardOptions';
import React from 'react';

// import template from "./Card.jsx";

/*Props:
  suit - the color of the card
  number - the number of the card
  knowldege:
    color - boolean if knowledge is known
    number - boolean if number is known
*/

class MyCard extends Card{
  backgroundColor() {
    if (this.props.knowledge.color) {
      return super.backgroundColor()
    }
    return '#888';
  }

  cardOptions = () => <MyCardOptions 
    {...this.props.knowledge}  
    showOptions={this.state.showOptions} 
    discard = {this.props.discard}
    />

  get number() {
    return this.props.knowledge.number ? this.props.number : "?";
  }
}

export default MyCard;
