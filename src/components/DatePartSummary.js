import React, { PropTypes } from 'react';
 
/**
 * A counter button: tap the button to increase the count.
 */
class DatePartSummary extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('handleClick');
    this.props.changeDatePart(this.props.label);
  }

  render() {
    let className = 'datePartThingy';

    if (this.props.isSelected) {
      className += ' datePartThingy-selected';
    }

    let openedSpan = <div><span>Opened: {this.props.opened}</span></div>;
    let closedSpan = <div><span>Closed: {this.props.closed}</span></div>;
    let maxSpan = <div><span>Max: {this.props.max}</span></div>;

    return (
      <div class={className}>
        <div class='datePartHeader' onClick={this.handleClick}>{this.props.label}</div>
        {this.props.opened && openedSpan}
        {this.props.closed && closedSpan}
        {this.props.max && maxSpan}
        
      </div>
    );
  }
}

DatePartSummary.propTypes = {
  //label: PropTypes.string.isRequired,
  //opened: PropTypes.object,
  //closed: PropTypes.object,
  //max: PropTypes.object,
  //isSelected: PropTypes.bool.isRequired
}

export default DatePartSummary;