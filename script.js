initView = function() {
	chrome.storage.local.get(['NumberTabs', 'counter'], function(data) {
		document.getElementById('openTabs').innerHTML = JSON.stringify(data.NumberTabs);
		document.getElementById('counter').innerHTML = JSON.stringify(data.counter);
	});
};

document.addEventListener('DOMContentLoaded', initView);
