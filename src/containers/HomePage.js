import React from 'react';
import DatePartSummary from '../components/DatePartSummary.js'
import MyGraph from '../components/MyGraph.js'
 
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
    		'totals': {'today': {}, 'thisWeek': {}, 'thisMonth': {}, 'thisYear': {}},
    		'chartData': []
    	};

		chrome.storage.local.get(['recordsBegan', 'currentState', 'totals', 'history'], (data) => {
			me.setState({
				'recordsBegan': data.recordsBegan,
				'currentState': data.currentState,
				'totals': data.totals,
				'chartData': me.getChartData(data.history)
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

	getChartData(history) {
		console.log('history');
		console.log(history);
		var toReturn = history.map((element) => [element.timestamp, element.numTabs]);
		console.log(toReturn);
		return toReturn;
	}

	render() {
		return (
			<div>
				<table class='mainTable'>
					<tbody>
						<tr>
							<td>
								<h3>Tabs open</h3>
								<div>{this.state.currentState.numTabs}</div>
							</td>
							<td>
								<h3>Windows open</h3>
								<div>{this.state.currentState.numWindows}</div>
							</td>
							<td>
								<h3>Tabs in busiest window</h3>
								<div>{this.state.currentState.busiestWindow}</div>
							</td>
						</tr>
						<tr>
							<td colspan='3' rowspan='5'>
								<MyGraph data={this.state.chartData} size={[600,300]}/>
							</td>
							<td>
								<h3>Ever</h3>
								<p>Opened: {this.state.totals.totalCreated} Closed: {this.state.totals.totalRemoved} Max: {this.state.totals.maxTabsEver}</p>
							</td>
						</tr>
						<tr><td>
							<DatePartSummary label='Today' count={this.state.totals.today.count} max={this.state.totals.today.max}/>
						</td></tr>
						<tr><td>
							<DatePartSummary label='This Week' count={this.state.totals.thisWeek.count} max={this.state.totals.thisWeek.max}/>
						</td></tr>
						<tr><td>
							<DatePartSummary label={this.getMonth()} count={this.state.totals.thisMonth.count} max={this.state.totals.thisMonth.max}/>
						</td></tr>
						<tr><td>
							<DatePartSummary label='This Year' count={this.state.totals.thisYear.count} max={this.state.totals.thisYear.max}/>
						</td></tr>
					</tbody>
				</table>

				
				

				<h3>Records began</h3>
				{new Date(this.state.recordsBegan).toDateString()}

				

				<div><button onClick={this.resetPressed}>Reset History</button></div>
			</div>
		);
	}
}
export default Homepage;