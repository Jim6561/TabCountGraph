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
        <h2>{this.props.label}</h2>
        Opened: {this.props.count} Max: {this.props.max}
      </div>
    );
  }
}
export default DatePartSummary;