initView = function() {
	document.getElementById('resetButton').addEventListener('click', resetPressed);

	chrome.storage.local.get(['NumberTabs', 'history', 'recordsBegan'], function(data) {
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.NumberTabs);
		document.getElementById('history').innerHTML = JSON.stringify(data.history);
		document.getElementById('recordsBegan').innerHTML = new Date(data.recordsBegan).toDateString();
	});
};

resetPressed = function() {
	chrome.storage.local.remove('history');
	initView();
}

document.addEventListener('DOMContentLoaded', initView);
