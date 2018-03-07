chrome.browserAction.setBadgeText({text: "Nate"})

onTabsChange = function(tab) {
	let result = chrome.tabs.query({}, function(result) {
		let numberTabs = result.length;
		chrome.storage.local.set({'NumberTabs': numberTabs});
	});
	
	chrome.storage.local.get('counter', function(data) {
		if (!data.counter) {
			data.counter = 4;
		}
		data.counter++;
		chrome.storage.local.set(data);
	});
};

chrome.tabs.onCreated.addListener(onTabsChange);
chrome.tabs.onRemoved.addListener(onTabsChange);

