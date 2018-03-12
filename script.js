initView = function() {
	document.getElementById('resetButton').addEventListener('click', resetPressed);

	chrome.storage.local.get(['history', 'recordsBegan', 'current'], function(data) {
	
	console.log(data);
	
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.current.numTabs);
		document.getElementById('openWindows').innerHTML = JSON.stringify(data.current.numWindows);
		document.getElementById('maxTabs').innerHTML = JSON.stringify(data.current.maxTabs);
		document.getElementById('recordsBegan').innerHTML = new Date(data.recordsBegan).toDateString();
	});
};

resetPressed = function() {
	chrome.storage.local.remove('history');
	initView();
}

document.addEventListener('DOMContentLoaded', initView);
