getMonth = function(date) {
	var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];

	return monthNames[date.getMonth()];
}

initView = function() {
	document.getElementById('resetButton').addEventListener('click', resetPressed);

	document.getElementById('monthHeader').innerHTML = getMonth(new Date());

	chrome.storage.local.get(['recordsBegan', 'currentState', 'totals'], function(data) {
		console.log('script');
		console.log(data);
	
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.currentState.numTabs);
		document.getElementById('openWindows').innerHTML = JSON.stringify(data.currentState.numWindows);
		document.getElementById('busiestWindow').innerHTML = JSON.stringify(data.currentState.busiestWindow);
		
		document.getElementById('maxEver').innerHTML = JSON.stringify(data.totals.maxTabsEver);
		document.getElementById('totalCreated').innerHTML = JSON.stringify(data.totals.totalCreated);
		document.getElementById('totalRemoved').innerHTML = JSON.stringify(data.totals.totalRemoved);
		
		document.getElementById('todayCount').innerHTML = JSON.stringify(data.totals.today.count);
		document.getElementById('todayMax').innerHTML = JSON.stringify(data.totals.today.max);
		
		document.getElementById('weekCount').innerHTML = JSON.stringify(data.totals.thisWeek.count);
		document.getElementById('weekMax').innerHTML = JSON.stringify(data.totals.thisWeek.max);
		
		document.getElementById('monthCount').innerHTML = JSON.stringify(data.totals.thisMonth.count);
		document.getElementById('monthMax').innerHTML = JSON.stringify(data.totals.thisMonth.max);
		
		document.getElementById('yearCount').innerHTML = JSON.stringify(data.totals.thisYear.count);
		document.getElementById('yearMax').innerHTML = JSON.stringify(data.totals.thisYear.max);
		
		document.getElementById('recordsBegan').innerHTML = new Date(data.recordsBegan).toDateString();
	});
};

resetPressed = function() {
	console.log('resetting');
	chrome.storage.local.remove('history');

	//Maybe don't want this going forward, but good for developing
	chrome.storage.local.remove('totals');
	
	initView();
}

document.addEventListener('DOMContentLoaded', initView);
