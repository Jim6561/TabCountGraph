onTabCreated = function(tab) {
	onTabsChange({action: 'create'});
}

onTabRemoved = function(tab) {
	onTabsChange({action: 'remove'});
}

onTabsChange = function(input) {
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
		totalsObj.populate(data.totals);
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

	chrome.storage.local.set({'totals': totalsObj.writeForStorage()});
}

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


totalsObj = {

	totalCreated: 0,
	totalRemoved: 0,
	maxTabsEver: 0,
	today: null,
	//createdThisYear: null,

	populate: function(dataFromStorage) {
console.log('populate: ' + JSON.stringify(dataFromStorage));
		this.totalCreated = dataFromStorage.totalCreated,
		this.totalRemoved = dataFromStorage.totalRemoved,
		this.maxTabsEver = dataFromStorage.maxTabsEver,
		this.today = {
			token: dataFromStorage.todayToken,
			count: dataFromStorage.todayCount,
			max: dataFromStorage.todayMax
		};
	},

	writeForStorage: function() {
		console.log('writing');
		return {
			totalCreated: this.totalCreated,
			totalRemoved: this.totalRemoved,
			maxTabsEver: this.maxTabsEver,
			todayToken: this.today.token,
			todayMax: this.today.max,
			todayCount: this.today.count
		};
	},

	melgeCurrentState: function(currentState) {
console.log('melging: ' + currentState.numTabs + ' ' + this.maxTabsEver);
		if (currentState.numTabs > this.maxTabsEver) {
			this.maxTabsEver = currentState.numTabs;
		}
console.log('melging: ' + currentState.numTabs + ' ' + this.today.max);
console.log(this.today.token);
		if (this.today.token == this.getToday()) {
			if (currentState.numTabs > this.today.max) {
				this.today.max = currentState.numTabs;
			}
		}

	},

	reset: function() {
console.log('resetting');
		this.totalCreated = 0,
		this.totalRemoved = 0,
		this.maxTabsEver = 0,
		this.today = {
			token: this.getToday(),
			count: 0,
			max: 0
		};
	},

	getToday: function() {
		var d = new Date();
		d.setSeconds(0);
		d.setMinutes(0);
		d.setHours(0);
		return d.toString();
	},

	getThisYear: function() {
		return (new Date().getYear());
	},

	addTab: function() {
		this.totalCreated++;
		this.today.count++;	
	},

	removeTab: function() {
		this.totalRemoved++;
	}
}


chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onRemoved.addListener(onTabRemoved);

onTabsChange(); // just call it once for when you first load it up