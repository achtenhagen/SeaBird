this.data = [];
this.wordItems = [];
var feedsToUpdate = 0;
var currentFeedIndex = 0;
this.stories = [];
this.cookieType;
var unreadCount = 0;
this.errorNone = "0";
var interval = "00:00:05";
var currentTime = new Date()
var month = currentTime.getMonth() + 1
var day = currentTime.getDate()
var year = currentTime.getFullYear()
function AppAssistant(appController) {
	this.appController = appController;
}
AppAssistant.prototype.handleLaunch = function(params){
	if (params.dockMode || params.touchstoneMode) { 
		this.launchTouchstone();
	}
	if (params) {
		switch (params.action) {
			case "sync":
				this.updateFeeds();
				break;
		}
	}
	else {
            var pushMainScene = function(stageController) {
                stageController.pushScene("main");
            };
            var stageArguments = {name: 'main', lightweight: false};
            this.controller.createStageWithCallback(stageArguments, 
                pushMainScene.bind(this), "card"); 
		}
		
};
AppAssistant.prototype.launchTouchstone = function(sceneParams) {
	var dockStage = this.controller.getStageController('dock');
	if (dockStage) {
		dockStage.window.focus();
	} else {
		var f = function(stageController) {
			stageController.pushScene('exhibition', {dockmode:true});
		}.bind(this);
		this.controller.createStageWithCallback({name: 'dock', lightweight: true}, f, "dockMode");	
	}
};
AppAssistant.prototype.normalLaunch = function(sceneParams) {};
AppAssistant.prototype.updateFeeds = function(events){
	this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
	this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));							  									  
};
AppAssistant.prototype.sync = function(event){
	if (currentFeedIndex < feedsToUpdate) {
			var request = new Ajax.Request(this.data[currentFeedIndex].number, {
				method: "get",
				evalJSON: "false",
				onSuccess: this.checkSuccess.bind(this),
				onFailure: this.checkFailure.bind(this)
			});
		}
};
AppAssistant.prototype.checkFailure = function(transport) {	
currentFeedIndex ++;
if(currentFeedIndex < feedsToUpdate){
	this.sync();
}
	
};
AppAssistant.prototype.delayedNotify = function(event) {
		this.notify.delay(0.5);
};
	
AppAssistant.prototype.notificationCreated = function(text, stageController) {
		stageController.pushScene('dashboard', text, new Date());
};
AppAssistant.prototype.closeNotifications = function(event) {
		this.appController.removeAllBanners();
		this.appController.closeStage(this.kDashboardStageName);
};
AppAssistant.prototype.checkSuccess = function(transport){
	if (transport.responseXML === null && transport.responseText !== null) 
        transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
	var feedError = this.errorNone;
	feedError = this.processFeed(transport);      
	if (feedError === this.errorNone)
	{
		if(this.wordItems[currentFeedIndex].newestFeed == "" || this.wordItems[currentFeedIndex].newestFeed == null || this.wordItems[currentFeedIndex].newestFeed === 'undefined')
		{
			this.wordItems[currentFeedIndex].newestFeed = this.stories[0].title;
			this.wordItems[currentFeedIndex].stories = this.stories;
			this.wordItems[currentFeedIndex].unreadCount = this.stories.length;
			unreadCount += this.stories.length;
		}
		else if(this.wordItems[currentFeedIndex].newestFeed != this.stories[0].title)
		{
			this.newFeeds = [];
			var startIndex = 0;
			for (i = 0; i < this.stories.length; i++) 
			{
				if (this.stories[i].title == this.wordItems[currentFeedIndex].newestFeed)
					startIndex = i;
			}
		if(startIndex > 0  && this.wordItems[currentFeedIndex].stories.length > 0)
			{
			this.lastItem = [];
				this.lastItem[0] = {
					title: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].title,
					text: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].text,
					unreadStyle: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].unreadStyle,
					unread: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].unread,
					previewStyle: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].previewStyle,
					url: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].url,
					date: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].date,
					description: this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length-1].description
				}
				for (i = 0; i < startIndex; i++) {
					for (x = this.wordItems[currentFeedIndex].stories.length-1; x > 0; x--) {
						this.wordItems[currentFeedIndex].stories[x].title = this.wordItems[currentFeedIndex].stories[x - 1].title;
						this.wordItems[currentFeedIndex].stories[x].text = this.wordItems[currentFeedIndex].stories[x - 1].text;
						this.wordItems[currentFeedIndex].stories[x].unreadStyle = this.wordItems[currentFeedIndex].stories[x - 1].unreadStyle;
						this.wordItems[currentFeedIndex].stories[x].unread = this.wordItems[currentFeedIndex].stories[x - 1].unread;
						this.wordItems[currentFeedIndex].stories[x].previewStyle = this.wordItems[currentFeedIndex].stories[x - 1].previewStyle;
						this.wordItems[currentFeedIndex].stories[x].url = this.wordItems[currentFeedIndex].stories[x - 1].url;
						this.wordItems[currentFeedIndex].stories[x].date = this.wordItems[currentFeedIndex].stories[x - 1].date;
						this.wordItems[currentFeedIndex].stories[x].description = this.wordItems[currentFeedIndex].stories[x - 1].description;
					}
					this.wordItems[currentFeedIndex].stories[0] = {
						title: this.stories[startIndex-1-i].title,
						text: this.stories[startIndex-1-i].text,
						unreadStyle: this.stories[startIndex-1-i].unreadStyle,
						unread: this.stories[startIndex-1-i].unread,
						previewStyle: this.stories[startIndex-1-i].previewStyle,
						url: this.stories[startIndex-1-i].url,
						date: this.stories[startIndex-1-i].date,
						description: this.stories[startIndex-1-i].description
					}
					this.wordItems[currentFeedIndex].stories[this.wordItems[currentFeedIndex].stories.length] = {
						title: this.lastItem[0].title,
						text: this.lastItem[0].text,
						unreadStyle: this.lastItem[0].unreadStyle,
						unread: this.lastItem[0].unread,
						previewStyle: this.lastItem[0].previewStyle,
						url: this.lastItem[0].url,
						date: this.lastItem[0].date,
						description: this.lastItem[0].description
					}
				}	
			}	
			else if(startIndex > 0  && this.wordItems[currentFeedIndex].stories.length == 0)
			{
				var temp = 0;
				for(i = 0; i < startIndex; i++)
				{
					this.wordItems[currentFeedIndex].stories[temp] = {
						title: this.stories[i].title,
						text: this.stories[i].text,
						unreadStyle: this.stories[i].unreadStyle,
						unread: this.stories[i].unread,
						previewStyle: this.stories[i].previewStyle,
						url: this.stories[i].url,
						date: this.stories[i].date,
						description: this.stories[i].description
					}
					temp++;
				}
			}
			else if(startIndex == 0 && this.wordItems[currentFeedIndex].stories.length > 0)
			{
				this.wordItems[currentFeedIndex].unreadCount += this.stories.length;
				unreadCount += this.stories.length;
				for(i = 0; i < this.wordItems[currentFeedIndex].stories.length; i++)
				{
					this.stories[this.stories.length] = {
						title: this.wordItems[currentFeedIndex].stories[i].title,
						text: this.wordItems[currentFeedIndex].stories[i].text,
						unreadStyle: this.wordItems[currentFeedIndex].stories[i].unreadStyle,
						unread: this.wordItems[currentFeedIndex].stories[i].unread,
						previewStyle: this.wordItems[currentFeedIndex].stories[i].previewStyle,
						url: this.wordItems[currentFeedIndex].stories[i].url,
						date: this.wordItems[currentFeedIndex].stories[i].date,
						description: this.wordItems[currentFeedIndex].stories[i].description		
					}
				}
				this.wordItems[currentFeedIndex].stories = this.stories;
			}
			else if(startIndex == 0 && this.wordItems[currentFeedIndex].stories.length == 0)
			{
				this.wordItems[currentFeedIndex].newestFeed = this.stories[0].title;
				this.wordItems[currentFeedIndex].stories = this.stories;
				this.wordItems[currentFeedIndex].unreadCount = this.stories.length;
				unreadCount = this.stories.length;
			}
			this.wordItems[currentFeedIndex].newestFeed = this.stories[0].title;
			this.wordItems[currentFeedIndex].unreadCount += startIndex;
			unreadCount += startIndex;
		}
	}
	currentFeedIndex ++;
	if(currentFeedIndex < feedsToUpdate)
		this.sync();
	else
	{
		if(currentFeedIndex >= feedsToUpdate){
			this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
			this.feedDb.add("feeds",this.wordItems); 
			if(unreadCount > 0)
			{
				var pushMainScene = function(stageController) {
			        stageController.pushScene("dashboard",unreadCount);
			    };
			    var stageArguments = {name: 'dashboard', lightweight: true};
			    this.controller.createStageWithCallback(stageArguments, 
			        pushMainScene.bind(this), "dashboard"); 
			}
			else
			{
				try {
					this.cookie = new Mojo.Model.Cookie('prefs')
					var cookieSettings = this.cookie.get();
					interval = cookieSettings.interval;
				} catch (e) {
					interval = "00:15:00";
				}
					   if (interval !== "00:00:00") {
					   	this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
					   		method: "set",
					   		parameters: {
					   			"key": "update",
					   			"in": interval,
					   			"wakeup": true,
					   			"uri": "palm://com.palm.applicationManager/open",
					   			"params": {"id": "com.fioware.seabird3", "params": {"action": "sync"}}
					   		}
					   	});
					  }
			}
		}
		else
			this.sync();	
	}	
};
AppAssistant.prototype.processFeed = function(transport){
	try {
		this.stories = [];
		var feedType = transport.responseXML.getElementsByTagName("rss");
	        if (feedType.length > 0)    {
	            this.cookieType = "rss";
	        }
	        else    {    
	            feedType = transport.responseXML.getElementsByTagName("RDF");
	            if (feedType.length > 0)    {
	                this.cookieType = "RDF";
	            }
	            else {
	                feedType = transport.responseXML.getElementsByTagName("feed");
	                if (feedType.length > 0)    {
	                    this.cookieType = "atom";
	                }
	                else {
	                this.showUrlEditBox("Oops!", this.feedUrl + " is appears to be invalid. Would you like to edit this url?")
	                }
	            }
	        }
	        switch (this.cookieType) {
				case "atom":
					var atomEntries = transport.responseXML.getElementsByTagName("entry");
					for (var i = 0; i < atomEntries.length; i++) {
						if(atomEntries[i].getElementsByTagName("pubDate"))
							var d = atomEntries[i].getElementsByTagName("pubDate").item(0).textContent.substring(0,17);
						else
							var d = month + "/" + day + "/" + year;
						this.stories[i] = {
							title: unescape(atomEntries[i].getElementsByTagName("title").item(0).textContent),
							text: atomEntries[i].getElementsByTagName("content").item(0).textContent,
							headLine: atomEntries[i].getElementsByTagName("content").item(0).textContent.replace(/<\/?[^>]+(>|$)/g, ""), 
							unreadStyle: 'unread',
							unread: 'feedlist-unread',
							previewStyle: 'storyPreviewUnread truncating-text',
							url: atomEntries[i].getElementsByTagName("link").item(0).getAttribute("href"),
							date: d,
							description: ""
						};
						
						this.stories[i].summary = this.stories[i].text.replace(/(<([^>]+)>)/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/http:\S+/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/#[a-z]+/ig, "{");
						this.stories[i].summary = this.stories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/digg_url .../, "");
						this.stories[i].summary = unescape(this.stories[i].summary);
						this.stories[i].summary = this.stories[i].summary.substring(0, 101);
					}
					break;
					
				case "rss":
					var rssItems = transport.responseXML.getElementsByTagName("item");
					for (i = 0; i < rssItems.length; i++) {
						var d = "";
						try
						{
							if(transport.responseXML.getElementsByTagName("description") != 'undefined'){
								if(transport.responseXML.getElementsByTagName("description").item(0).textContent != null && transport.responseXML.getElementsByTagName("description").item(0).textContent.length > 0)
									var d = transport.responseXML.getElementsByTagName("description").item(0).textContent;
							}
						}
						catch(err){}
						var dateRetrieved = month + "/" + day + "/" + year;
						try
						{
							var dateRetrieved = rssItems[i].getElementsByTagName("pubDate").item(0).textContent.substring(0,17);
						}
						catch(err){}
						this.stories[i] = {
							title: unescape(rssItems[i].getElementsByTagName("title").item(0).textContent),
							text: rssItems[i].getElementsByTagName("description").item(0).textContent,
							headLine: rssItems[i].getElementsByTagName("description").item(0).textContent.replace(/<\/?[^>]+(>|$)/g, ""),
							unreadStyle: 'unread',
							unread: 'feedlist-unread',
							previewStyle: 'storyPreviewUnread truncating-text',
							url: rssItems[i].getElementsByTagName("link").item(0).textContent,
							date: dateRetrieved,
							description: d
						};
						this.stories[i].summary = this.stories[i].text.replace(/(<([^>]+)>)/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/http:\S+/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/#[a-z]+/ig, "{");
						this.stories[i].summary = this.stories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/digg_url .../, "");
						this.stories[i].summary = unescape(this.stories[i].summary);
						this.stories[i].summary = this.stories[i].summary.substring(0, 101);
					}
					break;
					
				case "RDF":
					var rdfItems = transport.responseXML.getElementsByTagName("item");
					for (i = 0; i < rdfItems.length; i++) {
					
						this.stories[i] = {
							title: unescape(rdfItems[i].getElementsByTagName("title").item(0).textContent),
							text: rdfItems[i].getElementsByTagName("description").item(0).textContent,
							unreadStyle: 'unread',
							unread: 'feedlist-unread',
							previewStyle: 'storyPreviewUnread truncating-text',
							url: rdfItems[i].getElementsByTagName("link").item(0).textContent,
							date: rdfItems[i].getElementsByTagName("pubDate").item(0).textContent.substring(0,17),
							description: ""
						};
						
						this.stories[i].summary = this.stories[i].text.replace(/(<([^>]+)>)/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/http:\S+/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/#[a-z]+/ig, "{");
						this.stories[i].summary = this.stories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
						this.stories[i].summary = this.stories[i].summary.replace(/digg_url .../, "");
						this.stories[i].summary = unescape(this.stories[i].summary);
						this.stories[i].summary = this.stories[i].summary.substring(0, 101);
					}
					break;
			}
	} catch (e) {
		
	}
};
AppAssistant.prototype.dbSuccess = function(settings){
	this.data = [];
	this.data = settings;
	if (settings == null)
	{
		this.data = [];
		this.data[0] = {
			'name': 'Fioware News',
			'number': 'http://fioware.com/feed/',
			'date': month + "/" + day + "/" + year,
			'unreadCount': 0,
			'stories':[],
			'icon': 'feedlist-default',
			'newestFeed': "",
			'description': 'Up to date news & announcements'
		}
		this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
		this.feedDb.add("feeds",this.data);
	}
		else
		{
			for (i = 0; i < this.data.length; i++) 
			{
				for(k = 0; k < this.data[i].stories.length; k++)
				{
					if (this.data[i].stories[k].unreadStyle == 'unread')
					{
						unreadCount ++;
					}	
				}
					this.data[i].unreadCount = unreadCount;
					if (unreadCount = 0)
					{
						this.data[i].unreadCount = 0;
					}
						unreadCount = 0;
			}
		}
	this.wordItems = [];
	for (i = 0; i<this.data.length;i++)
	{
	this.wordItems[i] = {name: this.data[i].name,
						 number: this.data[i].number,
						 date: this.data[i].date,
						 unreadCount: this.data[i].unreadCount,
						 stories: this.data[i].stories,	 
						 icon: 'feedlist-default',
						 newestFeed: this.data[i].newestFeed,
						 description: this.data[i].description};
	}
	if (this.data.length > 0) {
		currentFeedIndex = 0;
		feedsToUpdate = this.data.length;	
		this.sync();
	}	
};
AppAssistant.prototype.dbFailure = function(transaction, result) {
	this.data = [];
	this.data[0] = {
		'name': 'Fioware News',
		'number': 'http://fioware.com/feed/',
		'date': month + "/" + day + "/" + year,
		'unreadCount': 0,
		'stories':[],
		'icon': 'feedlist-default',
		'newestFeed': "",
		'description': 'Up to date news & announcements'
	}
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds",this.data);
}