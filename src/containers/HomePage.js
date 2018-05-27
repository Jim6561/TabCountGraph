import React from 'react';
import DatePartSummary from '../components/DatePartSummary.js'
import MyGraph from '../components/MyGraph.js'
import CurrentBox from '../components/CurrentBox.js'
 
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
			let dateType = data.selectedDateType ? data.selectedDateType : 'Today';
			me.setState({
				'recordsBegan': data.recordsBegan,
				'currentState': data.currentState,
				'totals': data.totals,
				//'chartData': me.getChartData(data.history),
				'dateType': dateType
			}, this.updateChartData);
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

	getMonth() {
		var monthIndex = (new Date()).getMonth();
		var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
		return monthNames[monthIndex];
	}

	changeDateRange(dateType) {
		console.log('change dateType: ' + dateType);
		this.setState({'dateType': dateType}, this.updateChartData);
		chrome.storage.local.set({'selectedDateType': dateType});

		// And then we change the contents of chartData
		this.updateChartData();
	}

	updateChartData() {
		console.log('dateType: ' + this.state.dateType);
		var startDate;
		//Let's work out the correct start date
		switch(this.state.dateType) {
			case 'Today':
				startDate = this.getToday();
				break;
			case 'Week':
				startDate = this.getThisWeek();
				break;
			case 'Month':
				startDate = this.getThisMonth();
				break;
			case 'Year':
				startDate = this.getThisYear();
				break;
			case 'Ever':
				startDate = new Date('2014-01-01');
				break;
		}
		console.log('startDate: ' + startDate);

		chrome.storage.local.get(['history'], (data) => {
			var chartData = [];

			data.history.forEach((element) => {
				if (element.timestamp > startDate) {
					chartData.push([element.timestamp, element.numTabs]);
				}
			});

			this.setState({'chartData': chartData});

		});
	}

	getToday() {
		var d = new Date();
		d.setSeconds(0);
		d.setMinutes(0);
		d.setHours(0);
		return d;
	}

	//Weeks start on Sunday. It just makes it easier
	getThisWeek() {
		var d = this.getToday(),
			dayOfWeekCount = d.getDay();
		d.setDate(d.getDate() - dayOfWeekCount);
		return d;
	}

	getThisMonth() {
		var d = this.getToday();
		d.setDate(1);
		return d;
	}

	getThisYear() {
		var d = this.getThisMonth();
		d.setMonth(0);
		return d;
	}

	getWindowsOpen() {
		var windows = this.state.currentState.windows;
		return windows ? windows.length : 0;
	}

	getBusiestWindowCount() {
		var windows = this.state.currentState.windows;
		if (!windows) {
			return 0;
		}

		var max = 0;
		windows.forEach((element) => {
			if (element > max) {
				max = element;
			}
		});
		return max;
	}

	getTabsOpenDescription() {
		var windows = this.state.currentState.windows;
		if (!windows) {
			return '';
		}

		var nonEmptyWindows = [];
		windows.forEach((value) => {
			if (value > 0) {
				nonEmptyWindows.push(value);
			}
		});

		if (nonEmptyWindows.length <= 1) {
			return this.state.currentState.numTabs;
		} else {
			return this.state.currentState.numTabs + ' = ' + nonEmptyWindows.join(' + ');
		}
	}

	render() {
		return (
			<div>
				<table class='mainTable'>
					<tbody>
						<tr>
							<td><CurrentBox label='Tabs open' value={this.getTabsOpenDescription()} /></td>
							<td><CurrentBox label='Windows open' value={this.getWindowsOpen()} /></td>
							<td><CurrentBox label='Tabs in busiest window' value={this.getBusiestWindowCount()} /></td>
						</tr>
						<tr>
							<td colspan='3' rowspan='5'>
								<MyGraph 
									data={this.state.chartData}
									size={[580,360]}
									dateType = {this.state.dateType}/>
							</td>
							<td>
								<DatePartSummary 
									label='Today'
									dateType='Today'
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
								dateType='Week'
								opened={this.state.totals.thisWeek.count} 
								max={this.state.totals.thisWeek.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === 'Week'}
							/>
						</td></tr>
						<tr><td>
							<DatePartSummary 
								label={this.getMonth()}
								dateType='Month'
								opened={this.state.totals.thisMonth.count} 
								max={this.state.totals.thisMonth.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === 'Month'}
							/>
						</td></tr>
						<tr><td>
							<DatePartSummary 
								label='This Year'
								dateType='Year'
								opened={this.state.totals.thisYear.count} 
								max={this.state.totals.thisYear.max} 
								changeDatePart={this.changeDateRange}
								isSelected={this.state.dateType === 'Year'}
							/>
						</td></tr>
						<tr><td>
							<DatePartSummary 
								label='Ever' 
								dateType='Ever'
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