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

		chrome.storage.local.get(['recordsBegan', 'currentState', 'totals', 'history', 'selectedDateType'], (data) => {
			console.log('getStorage:');
			console.log(data);
			let dateType = data.selectedDateType ? data.selectedDateType : 'Today';
			console.log('dateType: ' + dateType);
			me.setState({
				'recordsBegan': data.recordsBegan,
				'currentState': data.currentState,
				'totals': data.totals,
				'chartData': me.getChartData(data.history),
				'dateType': dateType
			});
		});

		this.resetPressed = this.resetPressed.bind(this);
		this.changeDateRange = this.changeDateRange.bind(this);
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

	changeDateRange(dateType) {
		console.log('change dateType: ' + dateType);
		this.setState({'dateType': dateType});
		chrome.storage.local.set({'selectedDateType': dateType});
	}

	getMonth() {
		var monthIndex = (new Date()).getMonth();
		var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
		return monthNames[monthIndex];
	}

	getChartData(history) {
		return history.map((element) => [element.timestamp, element.numTabs]);
	}

	render() {
		console.log('render dateType: ' + this.state.dateType);
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
								<DatePartSummary 
									label='Today' 
									opened={this.state.totals.today.count} 
									max={this.state.totals.today.max} 
									changeDatePart={this.changeDateRange}
									isSelected={this.state.dateType === 'Today'}
								/>
							</td>
						</tr>
						<tr><td>
							<DatePartSummary
								label='This Week' 
								opened={this.state.totals.thisWeek.count} 
								max={this.state.totals.thisWeek.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === 'This Week'}
								/>
						</td></tr>
						<tr><td>
							<DatePartSummary 
								label={this.getMonth()} 
								opened={this.state.totals.thisMonth.count} 
								max={this.state.totals.thisMonth.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === this.getMonth()}
								/>
						</td></tr>
						<tr><td>
							<DatePartSummary 
								label='This Year' 
								opened={this.state.totals.thisYear.count} 
								max={this.state.totals.thisYear.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === 'This Year'}
								/>
						</td></tr>
						<tr><td>
								<DatePartSummary label='Ever' 
									opened={this.state.totals.totalCreated} 
									closed={this.state.totals.totalRemoved} 
									max={this.state.totals.maxTabsEver} 
									changeDatePart={this.changeDateRange}
									isSelected={this.state.dateType === 'Ever'}
									/>
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