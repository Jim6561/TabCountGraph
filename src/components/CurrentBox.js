import React from 'react';
import PropTypes from 'prop-types';
 
/**
 * A counter button: tap the button to increase the count.
 */
class CurrentBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class='summaryBox'>
        <div class='summaryBoxLabel'>{this.props.label}</div>
        <div class='summaryBoxValue'>{this.props.value}</div>
      </div>
    );
  }
}

CurrentBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired
}

export default CurrentBox;