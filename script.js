initView = function() {
	document.getElementById('resetButton').addEventListener('click', resetPressed);

	chrome.storage.local.get(['history', 'recordsBegan', 'currentState'], function(data) {
	
	console.log(data);
	
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.currentState.numTabs);
		document.getElementById('openWindows').innerHTML = JSON.stringify(data.currentState.numWindows);
		document.getElementById('maxTabs').innerHTML = JSON.stringify(data.currentState.maxTabs);
		document.getElementById('recordsBegan').innerHTML = new Date(data.recordsBegan).toDateString();
	});
};

resetPressed = function() {
	chrome.storage.local.remove('history');
	initView();
}

document.addEventListener('DOMContentLoaded', initView);
