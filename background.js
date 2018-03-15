onTabsChange = function(tab) {
	chrome.windows.getAll({populate: true}, function(windows) {
		let currentState = {
			numTabs: 0,
			numWindows: 0,
			maxTabs: 0	
		};
		
		for (var i = 0; i<windows.length; i++) {
			currentState.numWindows++;	
			let thisTabs = windows[i].tabs.length;

			currentState.numTabs += thisTabs;
			if (thisTabs > currentState.maxTabs) {
				currentState.maxTabs = thisTabs;
			}
		}
		
		chrome.storage.local.set({'currentState': currentState});
		
		chrome.storage.local.get('history', function(data) {
			if (!data.history) {
				data.history = [];
				data.recordsBegan = Date.now();
			}
		
			currentState.timestamp = Date.now();
			data.history.push({currentState});
			chrome.storage.local.set(data);
		});

		updateBadge(currentState.numTabs);
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