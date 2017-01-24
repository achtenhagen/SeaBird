this.data = [];
this.stories = [];
this.errorNone = "0";
this.cookieType = "";
var interval = "00:15:00";
var rotationValue = true;
var language = "en";
var currentFeedReload = "";
var unreadCount = 0;
var feedsToUpdate = 0;
var currentFeedIndex = 0;
var shakeEnabled = false;
var coverFlowEnabled = false;
var cloudEnabled = false;
var currentTime = new Date();
var month = currentTime.getMonth() + 1
var day = currentTime.getDate()
var year = currentTime.getFullYear()
function MainAssistant() {};
MainAssistant.prototype.setup = function() {
	this.controller.document.body.addClassName('palm-dark');
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024) {
		document.getElementById('css').href = "stylesheets/touchpad.css";
		this.controller.enableFullScreenMode(false);
	}
	else
		this.controller.enableFullScreenMode(true);
	try 
	{
		this.cookie = new Mojo.Model.Cookie('prefs')
		var cookieSettings = this.cookie.get();
		rotationValue = cookieSettings.rotation;
		language = cookieSettings.language;
		interval = cookieSettings.interval;
		shakeEnabled = cookieSettings.shake;
	} catch (e) {
		this.cookie = new Mojo.Model.Cookie('prefs')
		this.cookie.remove();		
		language = "en";
		interval = "00:15:00";
		shakeEnabled = false;
		this.cookie = new Mojo.Model.Cookie('prefs')
		  	this.cookie.put({
				rotation: true,
				language: "en",
				interval: "00:15:00",
				shake: false
			})
	}
	if(cloudEnabled == true)
		document.getElementById('cloud-icon').setAttribute("class", "palm-dashboard-icon cloud-enabled");
	else
		document.getElementById('cloud-icon').setAttribute("class", "palm-dashboard-icon cloud-disabled");
	this.appController = Mojo.Controller.getAppController();
	if(language == null)
		language = "en";
	if (language == "en" || language == null) 
	{
		var addTxt = "Add..."
		var urlBoxTxt = 'RSS or Atom Feed URL...'
		var subTitleTxt = 'Subscription Title...'
	}	
	else 
		if (language == "de") 
		{
			var addTxt = "Hinzufuegen..."
			var urlBoxTxt = 'RSS oder Atom Feed URL...'
			var subTitleTxt = 'Abo Titel...'
		}		
	else 
		if (language == "fr") 
		{
			var addTxt = "Ajouter..."
			var urlBoxTxt = 'RSS ou Atom Feed URL...'
			var subTitleTxt = "Titre de l'abonnement..."
		}
			this.urlAttributes = {
			hintText: urlBoxTxt,
			textFieldName:	'textField',  
			multiline:		false,
			modelProperty:		'feedUrl',
			disabledProperty: 'disabled',
			focus: 			true, 
			modifierState: 	Mojo.Widget.capsLock,
			limitResize: 	false, 
			holdToEnable:  false, 
			focusMode:		Mojo.Widget.focusSelectMode,
			changeOnKeyPress: true,
			textReplacement: false,
			maxLength: 1000,
			requiresEnterKey: false,
			autoCapitalization: false
	}
	this.titleAttributes = {
		hintText: subTitleTxt,
		textFieldName:	'nameField',  
		multiline:		false,
		disabledProperty: 'disabled',
		modelProperty:		'feedTitle',
		autoCapitalization: true,
		maxLength: 100,
		holdToEnable:  true
	}
	this.UrlModel = {
			'feedUrl' : '',
			disabled: false
		};

	this.TitleModel = {
			'feedTitle' : '',
			disabled: false
		};
		this.controller.setupWidget('url', this.urlAttributes, this.UrlModel);
		this.controller.setupWidget('feedTitle', this.titleAttributes, this.TitleMode);	
	this.spinnerSAttrs = {
		spinnerSize: Mojo.Widget.spinnerSmall,
		property: 'spinning1'
	}	
		this.spinnerModel2 = {
			spinning1: false
		};	 			 	
	  this.attributes = {
           spacerHeight: 0,
           menuClass: 'no-fade'
        },
	this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:	[{iconPath: "images/gear.png", command: "pref"},{icon:'sync', command:'sync'},{iconPath: "images/repo.png", command:'search'}]});
	this.controller.setupWidget('wordList', 
		{itemTemplate:'main/listitem', 
		listTemplate:'main/listcontainer',
		swipeToDelete: true,
		reorderable: true,  
		addItemLabel:$L(addTxt), 
		autoconfirmDelete: false,
		formatters:{label:this.formatName.bind(this)}},
		this.listModel = {items: this.data});																				
		this.wordList = this.controller.get('wordList');	
		this.controller.setupWidget('small-activity-spinner2', this.spinnerSAttrs, this.spinnerModel2);	
		this.sync = this.sync.bindAsEventListener(this);	
		this.spinOn = this.spinOn.bind(this);
		this.spinOff = this.spinOff.bind(this);
		this.setWakeup = this.setWakeup.bind(this);		
		this.tapped = this.tapped.bindAsEventListener(this);
		this.deleteFeed = this.deleteFeed.bindAsEventListener(this);
		this.moveFeed = this.moveFeed.bindAsEventListener(this);
		this.hideMenu = this.hideMenu.bindAsEventListener(this);
		this.addNewFeedHandler = this.addNewFeed.bindAsEventListener(this);	
        this.controller.listen(document, 'shakeend', this.handleShakeEnd.bind(this));
		Mojo.Event.listen(this.controller.get('wordList'), Mojo.Event.listAdd,this.addNewFeedHandler);
		Mojo.Event.listen(this.controller.get('wordList'), Mojo.Event.listTap, this.tapped);
		Mojo.Event.listen(this.controller.get('wordList'), Mojo.Event.listDelete, this.deleteFeed);
		Mojo.Event.listen(this.controller.get('wordList'), Mojo.Event.listReorder, this.moveFeed);
		Mojo.Event.listen(this.controller.get('topBar'), Mojo.Event.tap, this.hideMenu);	
};
MainAssistant.prototype.hideMenu = function()
{
	this.controller.toggleMenuVisible(Mojo.Menu.commandMenu)
};
MainAssistant.prototype.addNewFeed = function(event){
	this.controller.showDialog({template: 'main/add-dialog',assistant: new SampleDialogAssistant(this)});
};
MainAssistant.prototype.handleScreen = function(event){
	if(event.state == "off")
		this.controller.window.close();	
};
MainAssistant.prototype.handleShakeEnd = function(event){
	if(shakeEnabled == true)
	{
		if(this.data.length > 0)
			{
				currentFeedIndex = 0;
				feedsToUpdate = this.data.length;
				this.sync();
			}	
	}
};
MainAssistant.prototype.orientationChanged = function(event){
	if(coverFlowEnabled == true)
	{
		var scenename = Mojo.Controller.stageController.activeScene().sceneName
		if(scenename == 'main')
		{
		if(rotationValue == true)
		{
		if(event == 'left' || event == 'right')
		{
		if(this.data.length > 0)
			Mojo.Controller.stageController.pushScene({'name': 'flow', sceneTemplate: 'flow/flow-scene',transition: Mojo.Transition.crossFade},this.data)
		}
		}
		}
	}
};
MainAssistant.prototype.spinOn = function(){
				this.spinnerModel2.spinning1 = true;
				this.controller.modelChanged(this.spinnerModel2);    
}
MainAssistant.prototype.spinOff = function(){
				this.spinnerModel2.spinning1 = false;
				this.controller.modelChanged(this.spinnerModel2);    
}
MainAssistant.prototype.sync = function(){	
		if(currentFeedIndex < feedsToUpdate)
		{
			this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
			this.spinOn();
			var request = new Ajax.Request(this.data[currentFeedIndex].number, {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
		}
};
MainAssistant.prototype.checkSuccess = function(transport){
	if (transport.responseXML === null && transport.responseText !== null) 
        transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
	var feedError = this.errorNone;
	feedError = this.processFeed(transport);      
	if (feedError === this.errorNone)
	{
		if(this.data[currentFeedIndex].newestFeed == "" || this.data[currentFeedIndex].newestFeed == null || this.data[currentFeedIndex].newestFeed === 'undefined')
		{
			this.data[currentFeedIndex].newestFeed = this.stories[0].title;
			this.data[currentFeedIndex].stories = this.stories;
			this.data[currentFeedIndex].unreadCount = this.stories.length;
		}
		else if(this.data[currentFeedIndex].newestFeed != this.stories[0].title)
		{
			this.newFeeds = [];
			var startIndex = 0;
			for (i = 0; i < this.stories.length; i++) 
			{
				if (this.stories[i].title == this.data[currentFeedIndex].newestFeed)
					startIndex = i;
			}
		if(startIndex > 0  && this.data[currentFeedIndex].stories.length > 0)
			{
				this.lastItem = [];
				this.lastItem[0] = {
					title: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].title,
					text: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].text,
					unreadStyle: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].unreadStyle,
					unread: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].unread,
					previewStyle: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].previewStyle,
					url: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].url,
					date: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].date,
					description: this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length-1].description
				}
				for (i = 0; i < startIndex; i++) {
					for (x = this.data[currentFeedIndex].stories.length-1; x > 0; x--) {
						this.data[currentFeedIndex].stories[x].title = this.data[currentFeedIndex].stories[x - 1].title;
						this.data[currentFeedIndex].stories[x].text = this.data[currentFeedIndex].stories[x - 1].text;
						this.data[currentFeedIndex].stories[x].unreadStyle = this.data[currentFeedIndex].stories[x - 1].unreadStyle;
						this.data[currentFeedIndex].stories[x].unread = this.data[currentFeedIndex].stories[x - 1].unread;
						this.data[currentFeedIndex].stories[x].previewStyle = this.data[currentFeedIndex].stories[x - 1].previewStyle;
						this.data[currentFeedIndex].stories[x].url = this.data[currentFeedIndex].stories[x - 1].url;
						this.data[currentFeedIndex].stories[x].date = this.data[currentFeedIndex].stories[x - 1].date;
						this.data[currentFeedIndex].stories[x].description = this.data[currentFeedIndex].stories[x - 1].description;
					}
					this.data[currentFeedIndex].stories[0] = {
						title: this.stories[startIndex-1-i].title,
						text: this.stories[startIndex-1-i].text,
						unreadStyle: this.stories[startIndex-1-i].unreadStyle,
						unread: this.stories[startIndex-1-i].unread,
						previewStyle: this.stories[startIndex-1-i].previewStyle,
						url: this.stories[startIndex-1-i].url,
						date: this.stories[startIndex-1-i].date,
						description: this.stories[startIndex-1-i].description
					}
					this.data[currentFeedIndex].stories[this.data[currentFeedIndex].stories.length] = {
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
			else if(startIndex > 0  && this.data[currentFeedIndex].stories.length == 0)
			{
				var temp = 0;
				for(i = 0; i < startIndex; i++)
				{
					this.data[currentFeedIndex].stories[temp] = {
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
			else if(startIndex == 0 && this.data[currentFeedIndex].stories.length > 0)
			{
				this.data[currentFeedIndex].unreadCount += this.stories.length;
				for(i = 0; i < this.data[currentFeedIndex].stories.length; i++)
				{
					this.stories[this.stories.length] = {
						title: this.data[currentFeedIndex].stories[i].title,
						text: this.data[currentFeedIndex].stories[i].text,
						unreadStyle: this.data[currentFeedIndex].stories[i].unreadStyle,
						unread: this.data[currentFeedIndex].stories[i].unread,
						previewStyle: this.data[currentFeedIndex].stories[i].previewStyle,
						url: this.data[currentFeedIndex].stories[i].url,
						date: this.data[currentFeedIndex].stories[i].date,
						description: this.data[currentFeedIndex].stories[i].description		
					}
				}
				this.data[currentFeedIndex].stories = this.stories;
			}
			else if(startIndex == 0 && this.data[currentFeedIndex].stories.length == 0)
			{
				this.data[currentFeedIndex].newestFeed = this.stories[0].title;
				this.data[currentFeedIndex].stories = this.stories;
				this.data[currentFeedIndex].unreadCount = this.stories.length;
			}
			this.data[currentFeedIndex].newestFeed = this.stories[0].title;
			this.data[currentFeedIndex].unreadCount += startIndex;
		}
		this.listModel.items = this.data;
		this.controller.modelChanged(this.listModel);
	}
	currentFeedIndex ++;
	if(currentFeedIndex < feedsToUpdate)
		this.sync();
	else
	{
		this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
		this.feedDb.add("feeds",this.data);
		this.spinOff();	 
		this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);	
	}	
};
MainAssistant.prototype.processFeed = function (transport) {
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
	this.spinOff();
	this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);	
}
this.controller.serviceRequest('palm://com.palm.display', {
    	method:'status',
    	parameters:{},
		onSuccess: this.handleScreen.bind(this),
        onFailure: {}
});	
};
MainAssistant.prototype.checkFailure = function(){
currentFeedIndex ++;
if(currentFeedIndex >= feedsToUpdate){
	this.spinOff();
	this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
}
else
	this.sync();
};
MainAssistant.prototype.moveFeed = function(event){	
	var fromIndex = event.fromIndex;
    var toIndex = event.toIndex;	
    this.data.splice(fromIndex, 1);
    this.data.splice(toIndex, 0, event.item);
	this.data.splice(fromIndex, 1);
    this.data.splice(toIndex, 0, event.item); 	
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds", this.data);
};
MainAssistant.prototype.deleteFeed = function(event){
	this.tempItems = [];
		if (this.data.length > 0) {
			for(i = 0;i<this.data.length;i++)
		{
			if (this.data[i].name == event.item.name)
				try 
				{
					this.data.splice(i,1);
					this.data.splice(i,1);
				}
				catch (e) {}	
		}
				this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
				this.feedDb.add("feeds", this.data);		
		}
};
MainAssistant.prototype.formatName = function(n, model){
	return n;
};	
MainAssistant.prototype.tapped = function(event) {	
try {
	Mojo.Controller.stageController.pushScene({'name': 'storyList', sceneTemplate: 'storyList/storyList-scene',transition: Mojo.Transition.crossFade},this.data[event.index].name,this.data[event.index].number,this.data,language)	
} catch (e) {
	this.showDialogBox("",e.message);
}
	
};
MainAssistant.prototype.activate = function(event) {		
		try {		
		 	this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
		   		 method: "clear",
        		 parameters: {"key": "update"},
		   		}
		   	);
			this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
			this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));
			this.cookie = new Mojo.Model.Cookie('prefs')
			var cookieSettings = this.cookie.get();
			interval = cookieSettings.interval;		
			shakeEnabled = cookieSettings.shake;
			rotationValue = cookieSettings.rotation
			coverFlowEnabled = cookieSettings.coverFlow
			} catch (e) {
				shakeEnabled = false;
				rotationValue = false;
			} 	
	if (rotationValue == true)
		this.controller.stageController.setWindowOrientation('free');
	else
		this.controller.stageController.setWindowOrientation('up');
			
};
MainAssistant.prototype.deactivate = function(event) {
	this.spinOff();
	this.setWakeup();
};
MainAssistant.prototype.cleanup = function(event) {};		
MainAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'about':
				this.controller.showAlertDialog({
					title: $L("Sea Bird 2 - V" + Mojo.appInfo.version),
					message: $L("Copyright 2011, Maurice Achtenhagen"),
					choices: [{
						label: $L('Close'),
						value: "refresh",
						type: 'affirmative'
					}]
				});
				break;
				case 'pref':
				this.controller.stageController.pushScene('preferences',this.data,language);
				break;
			case 'help':
			this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
			break;
			case 'refresh':			
					this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
					this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));	
				
		break;
		case 'search':
			this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    		method: 'getstatus',
				evalJSON: 'true',
	    		parameters: {subscribe:false},
	    		onSuccess: this.handleLiveResponse.bind(this),
	    		onFailure: this.handleErrResponse.bind(this)
			});	
		break;
		case 'sync':
			this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    		method: 'getstatus',
				evalJSON: 'true',
	    		parameters: {subscribe:false},
	    		onSuccess: this.handleOKResponse.bind(this),
	    		onFailure: this.handleErrResponse.bind(this)
			});		
		break;
		}
	}
};
MainAssistant.prototype.handleLiveResponse = function(response){
	var isConnected;
	isConnected = response.isInternetConnectionAvailable;
	if(isConnected == true)
		this.controller.stageController.pushScene("live",this.data, language);
	else
	{
			var pushPopupScene = function(stageController) {
			stageController.pushScene('popup-alert')
		}
		Mojo.Controller.appController.createStageWithCallback({
			lightweight: true,
			name: "popup-alert",
			htmlFileName: "notification",
			height: 145},
		pushPopupScene, 'popupalert');
	}		
};
MainAssistant.prototype.handleOKResponse = function(response){
	var isConnected;
	isConnected = response.isInternetConnectionAvailable;
	if(isConnected == true)
	{
		if(this.data.length > 0)
			{
				currentFeedIndex = 0;
				feedsToUpdate = this.data.length;
				this.sync();
			}
	}
	else
	{
			var pushPopupScene = function(stageController) {
			stageController.pushScene('popup-alert')
		}
		Mojo.Controller.appController.createStageWithCallback({
			lightweight: true,
			name: "popup-alert",
			htmlFileName: "notification",
			height: 145},
		pushPopupScene, 'popupalert');
	}		
};
MainAssistant.prototype.handleErrResponse = function(response){};
MainAssistant.prototype.showDialogBox = function(title,message){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}
MainAssistant.prototype.checkFailure = function(transport) {
   	this.showDialogBox("Error","Invalid URL - Please Retry.");
	currentFeedIndex ++;
if(currentFeedIndex >= feedsToUpdate){
	this.spinOff();
}
else
	this.sync();
};
MainAssistant.prototype.spinOn = function(){
			this.spinnerModel2.spinning1 = true;
			this.controller.modelChanged(this.spinnerModel2);     
};

MainAssistant.prototype.spinOff = function(){
			this.spinnerModel2.spinning1 = false;
			this.controller.modelChanged(this.spinnerModel2);	      
};
MainAssistant.prototype.showErrorBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
};
MainAssistant.prototype.dbSuccess = function(settings){
	this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
	this.data = [];
	this.data = settings;
	allowReload = true;
	if (settings == null)
	{
		this.data = [];
		this.data[0] = {
			'name': 'Fioware News',
			'number': 'http://fioware.com/feed/',
			'unreadCount': 0,
			'stories':[],
			'icon': 'feedlist-default',
			'newestFeed': "",
			'date': month + "/" + day + "/" + year,
			'description': 'Up to date news & announcements'
		}
		this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
		this.feedDb.add("feeds",this.data);
	}	
		this.listModel.items = this.data;       
   		this.controller.modelChanged(this.listModel);
   		this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
   		
};
MainAssistant.prototype.dbFailure = function(transaction, result) {}
MainAssistant.prototype.setWakeup = function(){
       if (interval !== "00:00:00")   {
            this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
                method: "set",
                parameters: {
                    "key": "update",
                    "in": interval,
                    "wakeup": true,
                    "uri": "palm://com.palm.applicationManager/open",
                    "params": {
                        "id": "com.fioware.seabird3",
                        "params": {"action": "sync"}
                    }
                }
            });
        }
};
var SampleDialogAssistant = Class.create({
	initialize: function(sceneAssistant) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
		this.data = [];
		var duplicateTitleTxt = "";
	},
	
	setup : function(widget) {
		this.widget = widget;
		var culture = "en";
		this.cookie = new Mojo.Model.Cookie('prefs')
		var cookieSettings = this.cookie.get();
		culture = cookieSettings.language;
		if(culture == "en")
		{
			this.controller.get('subDetailsTxt').update("Subscription Details");
			var submitFeedtxt = 'Upload Feed'
			var categoryTxt = 'Category'	
			var addSubTxt = 'Add Subscription'
			var cancelBtn = 'Cancel'
			duplicateTitleTxt = "Duplicate found"
			var repoBodyTxt = "Would you like to help Feed Discovery grow by submitting this feed to our database? (No personal information will be sent)."
			var yesBtn = 'Yes'
			var noBtn = 'No'	
		}	
		else if(culture == "de")
		{
			this.controller.get('subDetailsTxt').update('Abo-Details');			
			var submitFeedtxt = 'Abo Hochladen'
			var categoryTxt = 'Kategorie'
			var addSubTxt = 'Abo Hinzufuegen'
			var cancelBtn = 'Abbrechen'
			duplicateTitleTxt = "Abo existiert bereits"
			var repoBodyTxt = "Moechten Sie die Feed Discovery Datenbank durch den Eintrag dieses Feeds erweitern? (keine persoenlichen Daten werden gesendet)."
			var yesBtn = "Ja"
			var noBtn = "Nein"
		}	
		else if(culture == "fr")
		{
			this.controller.get('subDetailsTxt').update("d&eacute;tails de l'abonnement");	
			var submitFeedtxt = 'Telecharger RSS'
			var categoryTxt = 'Categorie'
			var addSubTxt = "Ajouter l'abonnement"
			var cancelBtn = 'Annuler'
			duplicateTitleTxt = "Dupliquer trouve"
			var repoBodyTxt = "Souhaitez-vous elargir la base de donnees RSS Decouverte par l'entree de cet aliment? (Aucune donnee personnelle ne sera envoyee)."
			var yesBtn = 'Oui'
			var noBtn = 'Non'	
		}	
		this.controller.get('confirmFeed').update(addSubTxt);
		this.controller.get('cancelFeed').update(cancelBtn);
		this.firstAttributes = {
		label: $L(categoryTxt), 
		choices: [
				{label: $L('Arts & Entertainment'), value: 0},
				{label: $L('Auto and Truck'), value: 1},
				{label: $L('Books and Magazines'), value: 2},
				{label: $L('Business and Finance'), value: 3},
				{label: $L('Celebrities'), value: 4},
				{label: $L('Culture'), value: 5},
				{label: $L('Education'), value: 6},
				{label: $L('Environment'), value: 7},
				{label: $L('Health and Lifestyle'), value: 8},
				{label: $L('How To'), value: 9},
				{label: $L('Law'), value: 10},
				{label: $L('Music'), value: 11},
				{label: $L('Other'), value: 12},
				{label: $L('Palm'), value: 13},
				{label: $L('Politics'), value: 14},
				{label: $L('Programming'), value: 15},
				{label: $L('Religion'), value: 16},
				{label: $L('Science'), value: 17},
				{label: $L('Shopping'), value: 18},
				{label: $L('Social'), value: 19},
				{label: $L('Sports'), value: 20},
				{label: $L('Technology'), value: 21},
				{label: $L('Travel'), value: 22},
				{label: $L('Video Games'), value: 23},
				{label: $L('World'), value: 24},
				{label: $L('BitTorrent'), value: 25},
				{label: $L('Wallpaper'), value: 26},], modelProperty:'firstValue' },
	this.firstModel = {
		'firstValue': 'Other' 
	}
		this.tattr = {
  			trueLabel:  yesBtn,
  			trueValue:  '' ,
 			falseLabel:  noBtn,
  			falseValue: '',
  			fieldName:  'toggle'
  		}
		this.tModel = {
			value:  true,   
 			disabled: false 
			
		}		 	
		this.controller.setupWidget('att-toggle', this.tattr,this.tModel);
		this.controller.setupWidget('firstSelector', this.firstAttributes, this.firstModel);
		this.controller.get('submitFeedtxt').update(submitFeedtxt);
		this.controller.get('confirmFeed').addEventListener(Mojo.Event.tap, this.handleClicked.bindAsEventListener(this));
		this.controller.get('cancelFeed').addEventListener(Mojo.Event.tap, this.handleClose.bindAsEventListener(this));
	},
	
	handleClose: function() {
		this.widget.mojo.close();
	},
	
	handleClicked: function(event){	
	if (this.controller.get('feedTitle').mojo.getValue().length >= 1 && this.controller.get('url').mojo.getValue().length >= 1) {
		this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
		this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));
		}
	else
		this.controller.get('errorStatus').update("Please enter a valid http url.");	
	},
	
	dbFailure: function(transaction, result) {
	this.controller.get('errorStatus').update("Error - " + result.message);	
	},
	
	dbSuccess: function(settings) {	
	this.data = [];
	this.data = settings;
	allowReload = true;
	if (this.data == null)
		{
		this.data = [];
		this.data[0] = {
			'name': 'Fioware News',
			'number': 'http://fioware.com/feed/',
			'unreadCount': 0,
			'stories':[],
			'icon': 'feedlist-default',
			'newestFeed': "",
			'date': month + "/" + day + "/" + year,
			'description': 'Up to date news & announcements'
		}
		}
	var request = new Ajax.Request(this.controller.get('url').mojo.getValue(), {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
	},
	
	checkSuccess: function(transport){
	try {
			if (transport.responseXML === null && transport.responseText !== null) {
            transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
     }
    var feedError = this.errorNone;
    feedError = this.processFeed(transport);                 
    if (feedError === this.errorNone) {
		if (this.validateUrl(this.controller.get('url').mojo.getValue()) == true) {
			if (this.data == null) {
				this.data[0] = {
					'name': this.controller.get('feedTitle').mojo.getValue(),
					'number': this.controller.get('url').mojo.getValue(),
					'unreadCount': 0,
					'stories': [],
					'icon': 'feedlist-default',
					'newestFeed': "",
					'date': month + "/" + day + "/" + year,
					'description': 'Up to date news & announcements'
				}
			}
			else {
				var exists = false;
				for (x = 0; x < this.data.length; x++) {
					if (this.data[x].number == this.controller.get('url').mojo.getValue()) {
						exists = true;
						duplicate = this.data[x].number
						duplicateName = this.data[x].name;
					}
				}
				if (exists == false) {
					this.data[this.data.length] = {
						'name': this.controller.get('feedTitle').mojo.getValue(),
						'number': this.controller.get('url').mojo.getValue(),
						'unreadCount': 0,
						'stories': [],
						'icon': 'feedlist-default',
						'newestFeed': "",
						'date': month + "/" + day + "/" + year,
						'description': 'Up to date news & announcements'
					}
				}
				else 
					if (exists == true) {
						this.controller.get('errorStatus').update(duplicateTitleTxt + " - " + this.controller.get('url').mojo.getValue());
					}
				
			}
			if (exists == false) {
				this.feedDb = new Mojo.Depot({
					name: "ext:feedDb",
					replace: false
				});
				this.feedDb.add("feeds", this.data);
			if (this.tModel.value == true) {
							if (this.controller.get('feedTitle').mojo.getValue().length > 0) {
				var request = new Ajax.Request("http://fioware.com/seabird/add_feed.php?name=" + this.controller.get('feedTitle').mojo.getValue() + "&url=" + this.controller.get('url').mojo.getValue() + "&cat=" + this.firstModel['firstValue'], {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkAjaxSuccess.bind(this),
                	onFailure: this.checkAjaxFailure.bind(this)
            		});
							}
							
						}
			else 	
			{
					this.handleClose();
					this.controller.stageController.popScene('main');
					Mojo.Controller.stageController.pushScene({'name': 'main', sceneTemplate: 'main/main-scene',transition: Mojo.Transition.none})
			}
							
			}
		}
		else {
			this.controller.get('errorStatus').update("Invalid Url - " + this.controller.get('url').mojo.getValue() + " is not a valid http url.")
		}
	}
		} catch (e) {
			this.controller.get('errorStatus').update("Error - " + e.message)
}
},

processFeed: function(transport){
	try {
		var feedType = transport.responseXML.getElementsByTagName("rss");
		if (feedType.length > 0) {
			this.cookieType = "rss";
		}
		else {
			feedType = transport.responseXML.getElementsByTagName("RDF");
			if (feedType.length > 0) {
				this.cookieType = "RDF";
			}
			else {
				feedType = transport.responseXML.getElementsByTagName("feed");
				if (feedType.length > 0) {
					this.cookieType = "atom";
				}
				else {
					this.showUrlEditBox("Oops!", this.feedUrl + " is appears to be invalid. Would you like to edit this url?")
					//Feed not supported, do later (assume feed is working)
				}
			}
		}
		switch (this.cookieType) {
			case "atom":
				// Temp object to hold incoming XML object
				var atomEntries = transport.responseXML.getElementsByTagName("entry");
				break;
				
			case "rss":
				// Temp object to hold incoming XML object
				var rssItems = transport.responseXML.getElementsByTagName("item");
				break;
				
			case "RDF":
				// Temp object to hold incoming XML object
				var rdfItems = transport.responseXML.getElementsByTagName("item");
				break;
		}
	} 
	catch (e) {
	}
},

checkFailure: function(transport){},

validateUrl: function(url) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);					
},

checkAjaxFailure: function(event){},

checkAjaxSuccess: function(event) {
	this.handleClose();
	this.controller.stageController.popScene('main');
	Mojo.Controller.stageController.pushScene({'name': 'main', sceneTemplate: 'main/main-scene',transition: Mojo.Transition.none})
},
});