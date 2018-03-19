initView = function() {
	document.getElementById('resetButton').addEventListener('click', resetPressed);

	chrome.storage.local.get(['history', 'recordsBegan', 'currentState', 'totals'], function(data) {
	
	console.log(data);
	
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.currentState.numTabs);
		document.getElementById('openWindows').innerHTML = JSON.stringify(data.currentState.numWindows);
		document.getElementById('busiestWindow').innerHTML = JSON.stringify(data.currentState.busiestWindow);
		document.getElementById('maxEver').innerHTML = JSON.stringify(data.totals.maxTabsEver);
		document.getElementById('totalCreated').innerHTML = JSON.stringify(data.totals.totalCreated);
		document.getElementById('totalRemoved').innerHTML = JSON.stringify(data.totals.totalRemoved);
		document.getElementById('recordsBegan').innerHTML = new Date(data.recordsBegan).toDateString();
	});
};

resetPressed = function() {
	chrome.storage.local.remove('history');

	//Maybe don't want this going forward, but good for developing
	chrome.storage.local.remove('totals');
	
	initView();
}

document.addEventListener('DOMContentLoaded', initView);
