onTabCreated = function(tab) {
	onTabsChange({action: 'create'});
}

onTabRemoved = function(tab) {
	onTabsChange({action: 'remove'});
}

onTabsChange = function(input) {
	console.log('current time: ' + (new Date()));
	chrome.windows.getAll({populate: true}, function(windows) {
		var currentState = {
			numTabs: 0,
			numWindows: 0,
			busiestWindow: 0
		};
		
		for (var i = 0; i<windows.length; i++) {
			currentState.numWindows++;	
			var thisTabs = windows[i].tabs.length;

			currentState.numTabs += thisTabs;
			if (thisTabs > currentState.busiestWindow) {
				currentState.busiestWindow = thisTabs;
			}
		}

		chrome.storage.local.get('totals', function(data) {
			updateTotals(data, input, currentState);
		});
		
		chrome.storage.local.set({'currentState': currentState});
		
		chrome.storage.local.get('history', function(data) {
			if (!data.history) {
				data.history = [];
				data.recordsBegan = Date.now();
			}
		
			currentState.timestamp = Date.now();
			data.history.push(currentState);
			chrome.storage.local.set(data);
		});

		updateBadge(currentState.numTabs);
	});
};

updateTotals = function(data, input, currentState) {
	console.log(data);
	console.log(input);
	
	if (data.totals) {
		totalsObj.data = data.totals;
	} else {
		totalsObj.reset();
	}

	if (currentState) {
		totalsObj.melgeCurrentState(currentState);
	}

	if (input && input.action) {		
		if (input.action === 'create') {
			totalsObj.addTab();
		} else if (input.action === 'remove') {
			totalsObj.removeTab();
		}
	}

	chrome.storage.local.set({'totals': totalsObj.data});
}

updateBadge = function(numberTabs) {
	chrome.browserAction.setBadgeText({text: '' + numberTabs});
	chrome.browserAction.setTitle({title: 'Tab Graph: Currently ' + numberTabs + ' open tabs'});
	
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

totalsObj = {

	melgeCurrentState: function(currentState) {
		if (currentState.numTabs > this.data.maxTabsEver) {
			this.data.maxTabsEver = currentState.numTabs;
		}

		this.melgeDatePart(this.data.today, currentState.numTabs, getToday());
		this.melgeDatePart(this.data.thisWeek, currentState.numTabs, getThisWeek());
		this.melgeDatePart(this.data.thisMonth, currentState.numTabs, getThisMonth());
		this.melgeDatePart(this.data.thisYear, currentState.numTabs, getThisYear());

	},

	melgeDatePart: function(datePartCounter, numTabs, freshToken) {
		console.log('cachedToken: ' + datePartCounter.token + ' freshToken: ' + freshToken);
		if (datePartCounter.token == freshToken) {
			if (numTabs > datePartCounter.max) {
				datePartCounter.max = numTabs;
			}
		} else {
			console.log('new time period thingy');
			datePartCounter.token = freshToken;
			datePartCounter.max = numTabs;
			datePartCounter.count = 0;
		}
	},

	reset: function() {
		console.log('resetting');
		this.data = {
			totalCreated: 0,
			totalRemoved: 0,
			maxTabsEver: 0,
			today: {
				token: null,
				count: 0,
				max: 0
			},
			thisWeek: {
				token: null,
				count: 0,
				max: 0
			},
			thisMonth: {
				token: null,
				count: 0,
				max: 0
			},
			thisYear: {
				token: null,
				count: 0,
				max: 0
			}
		};
	},

	addTab: function() {
		this.data.totalCreated++;
		this.data.today.count++;
		this.data.thisWeek.count++;
		this.data.thisMonth.count++;
		this.data.thisYear.count++;
	},

	removeTab: function() {
		this.data.totalRemoved++;
	}
}

getToday = function() {
	var d = new Date();
	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);
	return d.toString();
}

//Weeks start on Sunday. It just makes it easier
getThisWeek = function() {
	var d = new Date(),
		dayOfWeekCount = d.getDay();
	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);
	d.setDate(d.getDate() - dayOfWeekCount);
	return d.toString();
}

getThisMonth = function() {
	var now = new Date(),
		monthToken = now.getFullYear() + ' ' + now.getMonth();
	return monthToken;
}

getThisYear = function() {
	var yearToken = (new Date()).getFullYear();
	return yearToken;
}

chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onRemoved.addListener(onTabRemoved);

onTabsChange(); // just call it once for when you first load it up