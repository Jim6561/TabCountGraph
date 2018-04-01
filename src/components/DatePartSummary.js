import React from 'react';
 
/**
 * A counter button: tap the button to increase the count.
 */
class DatePartSummary extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <div>
        <h3>{this.props.label}</h3>
        Opened: {this.props.count} Max: {this.props.max}
      </div>
    );
  }
}
export default DatePartSummary;