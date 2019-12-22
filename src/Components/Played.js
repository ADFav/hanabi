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

class Played extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showOptions: false };
  }

  render = () => <div></div>
}

export default Played;