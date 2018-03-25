import React from 'react';
import DatePartSummary from '../components/DatePartSummary.js'
 
/**
 * A counter button: tap the button to increase the count.
 */
class Homepage extends React.Component {
	constructor() {
    	super();
    	var me = this;
		
		//We need to set state to something. We end up rendering the component before the call back
		//from storage.local.get executes and sets it properly
    	this.state = {
    		'recordsBegan': 0,
    		'currentState': {},
    		'totals': {'today': {}, 'thisWeek': {}, 'thisMonth': {}, 'thisYear': {}}
    	};

		chrome.storage.local.get(['recordsBegan', 'currentState', 'totals'], (data) => {
			me.setState({
				'recordsBegan': data.recordsBegan,
				'currentState': data.currentState,
				'totals': data.totals
			});
		});

		this.resetPressed = this.resetPressed.bind(this);
	}

	resetPressed(event) {
		var me = this;

		chrome.storage.local.remove('history');
		chrome.storage.local.remove('totals');

		chrome.tabs.query({}, function(result) {
			var numTabs = result.length,
				resetTotals =  {'totalCreated': 0, 'totalRemoved': 0, 'maxTabsEver': numTabs};
			me.setState({
				'totals': resetTotals,
				'recordsBegan': Date.now()
			});
		});
	}

	getMonth() {
		var monthIndex = (new Date()).getMonth();
		var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
		return monthNames[monthIndex];
	}

	render() {
		return (
			<div>
				<h1>Jim&apos;s amazing extension</h1>

				<h2>Tabs open</h2>
				<div>{this.state.currentState.numTabs}</div>

				<h2>Windows open</h2>
				<div>{this.state.currentState.numWindows}</div>

				<h2>Tabs in busiest window</h2>
				<div>{this.state.currentState.busiestWindow}</div>

				<h2>Ever</h2>
				<p>Opened: {this.state.totals.totalCreated} Closed: {this.state.totals.totalRemoved} Max: {this.state.totals.maxTabsEver}</p>

				<DatePartSummary label='Today' count={this.state.totals.today.count} max={this.state.totals.today.max}/>
				<DatePartSummary label='This Week' count={this.state.totals.thisWeek.count} max={this.state.totals.thisWeek.max}/>
				<DatePartSummary label={this.getMonth()} count={this.state.totals.thisMonth.count} max={this.state.totals.thisMonth.max}/>
				<DatePartSummary label='This Year' count={this.state.totals.thisYear.count} max={this.state.totals.thisYear.max}/>

				<h2>Records began</h2>
				{new Date(this.state.recordsBegan).toDateString()}

				<div><button onClick={this.resetPressed}>Reset History</button></div>
			</div>
		);
	}
}
export default Homepage;