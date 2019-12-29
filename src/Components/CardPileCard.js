import React from "react";
import Card from './Card';
// import template from "./Card.jsx";

/*Props:
  suit - the color of the card
  number - the number of the card
  knowldege:
    color - boolean if knowledge is known
    number - boolean if number is known
*/

class DiscardedCard extends Card {
  toggleOptions = () => null;
}

export default DiscardedCard;
