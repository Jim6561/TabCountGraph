initView = function() {
	
	let result = chrome.tabs.query({}, function(result) {
		let numberTabs = result.length;
		document.getElementById('myThing').innerHTML = JSON.stringify(numberTabs);
	});
}



document.addEventListener('DOMContentLoaded', initView);