onTabsChange = function(tab) {
	let result = chrome.tabs.query({}, function(result) {
		let numberTabs = result.length;
		chrome.storage.local.set({'NumberTabs': numberTabs});
		
		
		chrome.storage.local.get('history', function(data) {
			if (!data.history) {
				data.history = [];
				data.recordsBegan = Date.now();
			}
			
			data.history.push({
				timestamp: Date.now(),
				count: numberTabs});
			
			chrome.storage.local.set(data);
		});
		
		updateBadge(numberTabs);
	});
};

updateBadge = function(numberTabs) {
	chrome.browserAction.setBadgeText({text: '' + numberTabs});
	
	var color;
	if (numberTabs < 15) {
		color = [0,191,0,255];
	} else if (numberTabs < 20) {
		color = [63,223,0,255];
	} else if (numberTabs < 28) {
		color = [127,223,0,255];
	} else if (numberTabs < 34) {
		color = [191,191,0,255];
	} else if (numberTabs < 40) {
		color = [255,127,0,255];
	} else if (numberTabs < 50) {
		color = [255,63,0,255];
	} else {
		color = [255,0,0,255];
	}
	
	
	chrome.browserAction.setBadgeBackgroundColor({color: color});
};

chrome.tabs.onCreated.addListener(onTabsChange);
chrome.tabs.onRemoved.addListener(onTabsChange);


onTabsChange(); // just call it once for when you first load it up