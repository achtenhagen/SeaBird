this.stories = [];
this.errorNone = "0";
this.cookieType = "";
this.feedTitle = "";
this.feedUrl = "";
this.unreadCount = 0;
this.data = [];
var index = 0;
this.drawer;
var hasArchive = false;
var language = "en";
var markAllRead;
var markAllUnread;
var deleteAll;
var editFeed;
var resyncFeed;
var updateFeed;
var deleteAllBtn;
var deleteAllBtnBody;
var yesBtn;
var cancelBtn;
var deleteTxt;
var currentTime = new Date();
var month = currentTime.getMonth() + 1;
var day = currentTime.getDate();
var year = currentTime.getFullYear();
function StoryListAssistant(title,url,arg,l) {
	this.feedTitle = title;
	this.feedUrl = url;
	this.data = arg;
	this.articleState = 'unread';
	language = l;
}
StoryListAssistant.prototype.setup = function() {
	this.attributes = {spacerHeight: 0,menuClass: 'no-fade'};
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024){ 
		this.controller.enableFullScreenMode(false);
		document.getElementById('large-activity-spinner').style.marginTop = "50%";
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:[{icon: 'back', command: 'back'},{},{icon: 'delete', command: 'clear'}]});	
	}
	else
		this.controller.enableFullScreenMode(true);
	if (language == "en" || language == null)
	{
		this.controller.get('rightMenu').update('Menu');
		var urlBoxTxt = 'RSS or Atom Feed URL...'
		markAllRead = 'Mark all read'
		markAllUnread = 'Mark all unread'
		deleteAll = 'Delete all'
		editFeed = 'Edit Feed'
		resyncFeed = 'Re-sync'
		updateFeed = 'Update feed'
		deleteAllBtn = "Delete All?"
		deleteAllBtnBody = "This action cannot be undone."
		deleteTxt = 'Delete';
		yesBtn = 'Yes'
		cancelBtn = 'Cancel'
	}
	else if(language == "de")
	{
		this.controller.get('rightMenu').update('Menu');
		var urlBoxTxt = 'RSS oder Atom Feed URL...'
		markAllRead = "Als gelesen markieren"
		markAllUnread = "Als nicht gelesen markieren"
		deleteAll = 'Alle loeschen'
		editFeed = 'Abo bearbeiten'
		resyncFeed = 'Re-sync'
		updateFeed = 'Abo aktualisieren'
		deleteAllBtn = "Alle Loeschen?"
		deleteAllBtnBody = "Diese Aktion kann nicht rueckgaengig gemacht werden."
		deleteTxt = 'Entfernen'
		yesBtn = 'Ja'
		cancelBtn = 'Abbrechen'
		
	}
	else if(language == "fr")
	{
		this.controller.get('rightMenu').update('Menu');
		var urlBoxTxt = 'RSS ou Atom Feed URL...'
		markAllRead = "Tout marquer comme lu"
		markAllUnread = "Marquer tous non lus"
		deleteAll = "Supprimer toutes"
		editFeed = "Modifier l'abonnement"
		resyncFeed = 'Re-sync'
		updateFeed = "Mise a jour"
		deleteAllBtn = 'Supprimer toutes?'
		deleteAllBtnBody = 'Cette action ne peut pas etre annulee.'
		deleteTxt = 'Supprimer'
		cancelBtn = 'Annuler'
	}
	for(i=0;i<this.data.length;i++)
	{
		if(this.data[i].name == this.feedTitle)
		{
			index = i	
		}
	}
	var UrlAttributes = {
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
				maxLength: 75,
				requiresEnterKey: false
		};
		this.UrlModel = {
			'feedUrl' : this.feedUrl,
			disabled: false
		};
	this.controller.setupWidget('textField', UrlAttributes, this.UrlModel);
	this.spinnerAttrs = {
	spinnerSize: Mojo.Widget.spinnerLarge,
	property: 'spinning1'
	}	
	this.spinnerModel = {
		spinning1: true
	}; 
	this.controller.get('feedTitle').update(this.feedTitle);
	this.controller.get('feedUrl').update(this.feedUrl);
	this.controller.setupWidget("storyList",
         {
            itemTemplate:"storyList/listitem", 
            listTemplate:"storyList/listcontainer", 
            swipeToDelete:true, 
            renderLimit: 40,
            reorderable:false
        },
    this.storyListModel = {items: this.stories});
	this.stories = [];
				try {
					for(i=0;i<this.data.length;i++)
						{
							if(this.data[i].name == this.feedTitle)
							{
								hasArchive = true;
								index = i;
							}
						}
					if(this.data[index].stories != null && this.data[index].stories.length > 0){
						if(!Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 && !Mojo.Environment.DeviceInfo.screenWidth==1024 && !Mojo.Environment.DeviceInfo.screenHeight==1024)
							this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:[{},{},{icon: 'delete', command: 'clear'}]});	
					}
				} 
				catch (e) {
					this.showDialogBox(e.message);
					hasArchive = false;
				}
				
	this.storyListModel.items = this.stories;   
   	this.controller.modelChanged(this.storyListModel);
	this.exampleSpinner = 'large-activity-spinner';	
	this.controller.setupWidget('large-activity-spinner', this.spinnerAttrs, this.spinnerModel);
	this.scrim = Mojo.View.createScrim(this.controller.document, {onMouseDown:this.close.bind(this), scrimClass:'palm-scrim'});
	this.controller.get("scrim").appendChild(this.scrim).appendChild($(this.exampleSpinner));
	this.toggleDrawer = this.toggleDrawer.bindAsEventListener(this);
	this.popupHandler = this.popupHandler.bindAsEventListener(this);
	this.tapped = this.tapped.bindAsEventListener(this);
	this.resetScroll = this.resetScroll.bindAsEventListener(this);
	this.feedDelete = this.feedDelete.bindAsEventListener(this);
	this.spinOn = this.spinOn.bind(this);
	this.spinOff = this.spinOff.bind(this);
	Mojo.Event.listen(this.controller.get('storyList'), Mojo.Event.listDelete, this.feedDelete);
	Mojo.Event.listen(this.controller.get('storyList'), Mojo.Event.listTap, this.tapped);	
	Mojo.Event.listen(this.controller.get('rightMenu'), Mojo.Event.tap, this.toggleDrawer);	
	Mojo.Event.listen(this.controller.get('topBar'), Mojo.Event.tap, this.resetScroll);	
	if(hasArchive == true)
				{
					if (this.data[index].stories.length >= 1) {
						for (k = 0; k < this.data[index].stories.length; k++)
						{
							this.stories[k] = {
								title: this.data[index].stories[k].title,
								text: this.data[index].stories[k].text,
								headLine: this.data[index].stories[k].text.replace(/<\/?[^>]+(>|$)/g, ""),
								unreadStyle: this.data[index].stories[k].unreadStyle,
								unread: this.data[index].stories[k].unread,
								previewStyle: this.data[index].stories[k].previewStyle,
								url: this.data[index].stories[k].url,
								date: this.data[index].stories[k].date,
								description: this.data[index].description
							}	
							this.stories[k].headLine.trim;
							if(this.stories[k].headLine.startsWith(" "))
								this.stories[k].headLine = "No Preview Available For This Article"
							else if(this.stories[k].headLine == null || this.stories[k].headLine == "" || this.stories[k].headLine == " ")
								this.stories[k].headLine = "No Preview Available For This Article"	
							else if(this.stories[k].headLine.substring(0,1) == null || this.stories[0].headLine.substring(0,1) == "" || this.stories[0].headLine.substring(0,1).length == 0)
								this.stories[k].headLine = "No Preview Available For This Article"	
						} 
						this.scrim.hide();
					}
					else 
						if (this.data[index].newestFeed == "") {
							hasArchive = false;
						}
						else {
							hasArchive = true;
							this.scrim.hide();
						}
				}		
				if (hasArchive == false)
				//Download articles from url argument (if no offline stories are available)
				{
					try {	
					var request = new Ajax.Request(this.feedUrl, {
                	method: "get",
                	evalJSON: "false",
                	contentType: "text/xml",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
					} catch (e) {
					}
				}   
};
StoryListAssistant.prototype.close =  function(e){};
StoryListAssistant.prototype.open =  function(e){
		this.scrim.show();
};
StoryListAssistant.prototype.resetScroll = function(event){
	this.controller.get('storyList').mojo.revealItem(0,true);
};
StoryListAssistant.prototype.resync = function(event){
	this.scrim.show();
	this.stories = [];
	this.storyListModel.items = this.stories;
	this.controller.modelChanged(this.storyListModel);
	this.spinOn();
	this.data[index].stories = [];
	this.data[index].newestFeed = "";
	var request = new Ajax.Request(this.feedUrl, {
        method: "get",
        evalJSON: "false",
        onSuccess: this.checkSuccess.bind(this),
        onFailure: this.checkFailure.bind(this)});
};
StoryListAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'clear':
				this.showConfirmBox(deleteAllBtn,deleteAllBtnBody);
			break;	
			case 'back':
				this.controller.stageController.popScene();
			break;
		}
	}
};
StoryListAssistant.prototype.feedDelete = function(event) {		
		if (this.data[index].stories.length > 0) {
			for(i = 0;i<this.data[index].stories.length;i++)
		{
			if (this.data[index].stories[i].title == event.item.title)
			{
				try {	
				this.data[index].stories.splice(i,1)				
				} catch (e) {	
				}
				
			}
		}
				this.stories = this.data[index].stories;	
		}
};
StoryListAssistant.prototype.popupHandler = function(command){	
		switch (command) {
			case 'read':
				this.data[index].unreadCount = 0;
				for (i = 0; i < this.stories.length; i++) {	
					this.stories[i].unread = 'feedlist-read';
					this.stories[i].unreadStyle = 'read';
					this.stories[i].previewStyle = 'storyPreviewRead truncating-text';
				}
				this.storyListModel.items = this.stories;
				this.controller.modelChanged(this.storyListModel);
				break;
			case 'unread':
				this.data[index].unreadCount = this.stories.length;
				for (i = 0; i < this.stories.length; i++) {
					this.stories[i].unread = 'feedlist-unread';
					this.stories[i].unreadStyle = 'unread';
					this.stories[i].previewStyle = 'storyPreviewUnread truncating-text';
				}
				this.storyListModel.items = this.stories;
				this.controller.modelChanged(this.storyListModel);
				break;
			case 'delete':
				this.showConfirmBox(deleteAllBtn,deleteAllBtnBody);
				break;
			case 'update':
				this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    		method: 'getstatus',
				evalJSON: 'true',
	    		parameters: {subscribe:false},
	    		onSuccess: this.handleUpdateResponse.bind(this),
	    		onFailure: this.handleErrResponse.bind(this)
			});	
				break;
			case 'edit':
				this.controller.showDialog({template: 'storyList/edit-dialog',assistant: new EditDialogAssistant(this,this.feedTitle,this.feedUrl,this.data,language)});
				break;
			case 'resync':
				this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    		method: 'getstatus',
				evalJSON: 'true',
	    		parameters: {subscribe:false},
	    		onSuccess: this.handleOKResponse.bind(this),
	    		onFailure: this.handleErrResponse.bind(this)
			});	
				break;
		}
};
StoryListAssistant.prototype.handleOKResponse = function(response){
	var isConnected;
	isConnected = response.isInternetConnectionAvailable;
	if(isConnected == true)
		this.resync();
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
StoryListAssistant.prototype.handleUpdateResponse = function(response){
	var isConnected;
	isConnected = response.isInternetConnectionAvailable;
	if(isConnected == true)
		{
		 	try {	
					this.spinOn();
					var request = new Ajax.Request(this.feedUrl, {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
					} catch (e) {
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
StoryListAssistant.prototype.handleErrResponse = function(response){};
StoryListAssistant.prototype.toggleDrawer = function(event){
this.controller.popupSubmenu({
      onChoose: this.popupHandler,
      placeNear: event.target,
      items: [{label: $L(markAllRead), command:'read'},
	  {label: $L(markAllUnread), command:'unread' }, 
	  {label: $L(editFeed), command:'edit'},
	  {label: $L(resyncFeed), command:'resync'},
	  {label: $L(updateFeed), command:'update'}]
    }); 
};
StoryListAssistant.prototype.showConfirmBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		this.stories = [];
		this.storyListModel.items = this.stories;
		this.controller.modelChanged(this.storyListModel);
		//remove feeds from database
		for(i=0;i<this.data.length;i++)
						{
							if(this.data[i].name == this.feedTitle)
							{
								this.data[i].stories = [];
								this.data[i].unreadCount = 0;
								this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
								this.feedDb.add("feeds", this.data);
							}
						}
	}},
		title:title,
		message:message,
		choices:[{label: deleteTxt, value:'yes', type:'negative'}, {label:cancelBtn, value:'no', type:'default'}]
	});	
};
StoryListAssistant.prototype.tapped = function(event) {
		if(this.stories[event.index].unreadStyle == 'unread')
			this.data[index].unreadCount --;
		this.stories[event.index].unread = 'feedlist-read';
		this.stories[event.index].unreadStyle = 'read';
		this.stories[event.index].previewStyle = 'storyPreviewRead truncating-text';
		this.storyListModel.items = this.stories;       
   		this.controller.modelChanged(this.storyListModel); 
		Mojo.Controller.stageController.pushScene({'name': 'story', sceneTemplate: 'story/story-scene',
											  transition: Mojo.Transition.crossFade},event.item.title,event.item.text,event.item.url,event.index,this.stories,this.feedTitle,this.data)
}
StoryListAssistant.prototype.checkSuccess = function(transport){
	if (transport.responseXML === null && transport.responseText !== null) 
        transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
	var feedError = this.errorNone;
	feedError = this.processFeed(transport);      
	if (feedError === this.errorNone)
	{
		if(this.data[index].newestFeed == "" || this.data[index].newestFeed == null || this.data[index].newestFeed === 'undefined')
		{
			this.data[index].newestFeed = this.newStories[0].title;
			this.stories = this.newStories;
			this.data[index].unreadCount = this.newStories.length;
			this.storyListModel.items = this.stories;
			this.controller.modelChanged(this.storyListModel);
			this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
			this.feedDb.add("feeds",this.data);
			
		}
		else if(this.data[index].newestFeed != this.newStories[0].title)
		{
			this.newFeeds = [];
			var startIndex = 0;
			for (i = 0; i < this.newStories.length; i++) 
			{
				if (this.newStories[i].title == this.data[index].newestFeed)
					startIndex = i;
			}
		if(startIndex > 0  && this.stories.length > 0)
			{
				this.lastItem = [];
				this.lastItem[0] = {
					title: this.stories[this.stories.length-1].title,
					text: this.stories[this.stories.length-1].text,
					unreadStyle: this.stories[this.stories.length-1].unreadStyle,
					unread: this.stories[this.stories.length-1].unread,
					previewStyle: this.stories[this.stories.length-1].previewStyle,
					url: this.stories[this.stories.length-1].url,
					date: this.stories[this.stories.length-1].date,
					description: this.stories[this.stories.length-1].description,
					headLine: this.stories[this.stories.length-1].text.replace(/<\/?[^>]+(>|$)/g, "")
				}
				for (i = 0; i < startIndex; i++) {
					for (x = this.stories.length-1; x > 0; x--) {
						this.stories[x].title = this.stories[x - 1].title;
						this.stories[x].text = this.stories[x - 1].text;
						this.stories[x].unreadStyle = this.stories[x - 1].unreadStyle;
						this.stories[x].unread = this.stories[x - 1].unread;
						this.stories[x].previewStyle = this.stories[x - 1].previewStyle;
						this.stories[x].url = this.stories[x - 1].url;
						this.stories[x].date = this.stories[x - 1].date;
						this.stories[x].description = this.stories[x - 1].description;
						this.stories[x].headLine = this.stories[x - 1].text.replace(/<\/?[^>]+(>|$)/g, "");
					}
					this.stories[0] = {
						title: this.newStories[startIndex-1-i].title,
						text: this.newStories[startIndex-1-i].text,
						unreadStyle: this.newStories[startIndex-1-i].unreadStyle,
						unread: this.newStories[startIndex-1-i].unread,
						previewStyle: this.newStories[startIndex-1-i].previewStyle,
						url: this.newStories[startIndex-1-i].url,
						date: this.newStories[startIndex-1-i].date,
						description: this.newStories[startIndex-1-i].description,
						headLine: this.newStories[startIndex-1-i].text.replace(/<\/?[^>]+(>|$)/g, "")
					}
					this.stories[this.stories.length] = {
						title: this.lastItem[0].title,
						text: this.lastItem[0].text,
						unreadStyle: this.lastItem[0].unreadStyle,
						unread: this.lastItem[0].unread,
						previewStyle: this.lastItem[0].previewStyle,
						url: this.lastItem[0].url,
						date: this.lastItem[0].date,
						description: this.lastItem[0].description,
						headLine: this.lastItem[0].headLine
					}
				}
			}	
			else if(startIndex > 0  && this.stories.length == 0)
			{
				var temp = 0;
				for(i = 0; i < startIndex; i++)
				{
					this.stories[temp] = {
						title: this.newStories[i].title,
						text: this.newStories[i].text,
						unreadStyle: this.newStories[i].unreadStyle,
						unread: this.newStories[i].unread,
						previewStyle: this.newStories[i].previewStyle,
						url: this.newStories[i].url,
						date: this.newStories[i].date,
						description: this.newStories[i].description,
						headLine: this.newStories[i].text.replace(/<\/?[^>]+(>|$)/g, "")
					}
					temp++;
				}
			}
			else if(startIndex == 0 && this.stories.length > 0)
			{
				this.data[index].unreadCount += this.newStories.length;
				for(i = 0; i < this.stories.length; i++)
				{
					this.newStories[this.newStories.length] = {
						title: this.stories[i].title,
						text: this.stories[i].text,
						unreadStyle: this.stories[i].unreadStyle,
						unread: this.stories[i].unread,
						previewStyle: this.stories[i].previewStyle,
						url: this.stories[i].url,
						date: this.stories[i].date,
						description: this.stories[i].description,
						headLine: this.stories[i].text.replace(/<\/?[^>]+(>|$)/g, "")
					}
				}
				this.stories = this.newStories;
			}
			else if(startIndex == 0 && this.stories.length == 0)
			{
				this.data[index].newestFeed = this.newStories[0].title;
				this.stories = this.newStories;
				this.data[index].unreadCount = this.newStories.length;
			}
			this.data[index].newestFeed = this.newStories[0].title;
			this.data[index].unreadCount += startIndex;
			this.storyListModel.items = this.stories; 
			this.controller.modelChanged(this.storyListModel);
			this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
			this.feedDb.add("feeds",this.data);
		}
	}
		this.spinOff();	 		
};
StoryListAssistant.prototype.checkFailure = function(transport) {
	this.spinOff();
   	this.showUrlEditBox("Error","Invalid URL - Would you like to edit this subscription?");
};
StoryListAssistant.prototype.processFeed = function (transport) {
	this.newStories = [];
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
                	this.showUrlEditBox("Error", this.feedUrl + " appears to be invalid. Would you like to edit this url?")
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
					this.newStories[i] = {
						title: unescape(atomEntries[i].getElementsByTagName("title").item(0).textContent),
						text: atomEntries[i].getElementsByTagName("content").item(0).textContent,
						headLine: atomEntries[i].getElementsByTagName("content").item(0).textContent.replace(/<\/?[^>]+(>|$)/g, ""), 
						unreadStyle: 'unread',
						unread: 'feedlist-unread',
						previewStyle: 'storyPreviewUnread truncating-text',
						url: atomEntries[i].getElementsByTagName("link").item(0).getAttribute("href"),
						date: d,
						description: this.data[index].number
					};
					
					// Strip HTML from text for summary and shorten to 100 characters
					this.newStories[i].summary = this.newStories[i].text.replace(/(<([^>]+)>)/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/http:\S+/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/#[a-z]+/ig, "{");
					this.newStories[i].summary = this.newStories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/digg_url .../, "");
					this.newStories[i].summary = unescape(this.newStories[i].summary);
					this.newStories[i].summary = this.newStories[i].summary.substring(0, 101);
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
					this.newStories[i] = {
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
					this.newStories[i].summary = this.newStories[i].text.replace(/(<([^>]+)>)/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/http:\S+/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/#[a-z]+/ig, "{");
					this.newStories[i].summary = this.newStories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
					this.newStories[i].summary = this.newStories[i].summary.replace(/digg_url .../, "");
					this.newStories[i].summary = unescape(this.newStories[i].summary);
					this.newStories[i].summary = this.newStories[i].summary.substring(0, 101);
				}
				break;
				
			case "RDF":
				var rdfItems = transport.responseXML.getElementsByTagName("item");	
					for (i = 0; i < rdfItems.length; i++) {
						try
						{
							this.newStories[i] = {
								title: unescape(rdfItems[i].getElementsByTagName("title").item(0).textContent),
								text: rdfItems[i].getElementsByTagName("description").item(0).textContent,
								headLine: rdfItems[i].getElementsByTagName("description").item(0).textContent.replace(/<\/?[^>]+(>|$)/g, ""),
								unreadStyle: 'unread',
								unread: 'feedlist-unread',
								previewStyle: 'storyPreviewUnread truncating-text',
								url: rdfItems[i].getElementsByTagName("link").item(0).textContent,
								date: rdfItems[i].getElementsByTagName("pubDate").item(0).textContent.substring(0,17),
								description: this.data[index].number
							};
						}
						catch(err)
						{
							this.newStories[i] = {
									title: unescape(rdfItems[i].getElementsByTagName("title").item(0).textContent),
									text: "",
									headLine: "",
									unreadStyle: 'unread',
									unread: 'feedlist-unread',
									previewStyle: 'storyPreviewUnread truncating-text',
									url: rdfItems[i].getElementsByTagName("link").item(0).textContent,
									date: rdfItems[i].getElementsByTagName("pubDate").item(0).textContent.substring(0,17),
									description: this.data[index].number
								};
						}
						this.newStories[i].summary = this.newStories[i].text.replace(/(<([^>]+)>)/ig, "");
						this.newStories[i].summary = this.newStories[i].summary.replace(/http:\S+/ig, "");
						this.newStories[i].summary = this.newStories[i].summary.replace(/#[a-z]+/ig, "{");
						this.newStories[i].summary = this.newStories[i].summary.replace(/(\{([^\}]+)\})/ig, "");
						this.newStories[i].summary = this.newStories[i].summary.replace(/digg_url .../, "");
						this.newStories[i].summary = unescape(this.newStories[i].summary);
						this.newStories[i].summary = this.newStories[i].summary.substring(0, 101);
						}
				break;
		}
};
StoryListAssistant.prototype.activate = function(event) {
		this.storyListModel.items = this.stories;       
   		this.controller.modelChanged(this.storyListModel); 
};

StoryListAssistant.prototype.deactivate = function(event) {
	if (this.stories == null) {	
		this.data[index].stories = [];
	}
	else 
	{
		for(k=0;k<this.stories.length;k++)
				{
					var d = "";
					try{
						if(this.stories[k].description != null)
							d = this.stories[k].description;
					}
					catch(err)
					{}
					this.data[index].stories[k] = {
							title: this.stories[k].title,
							text: this.stories[k].text,
							unreadStyle: this.stories[k].unreadStyle,
							unread: this.stories[k].unread,
							previewStyle: this.stories[k].previewStyle,
							url: this.stories[k].url,
							date: this.stories[k].date,
							description: d
						};
				}	
	}	
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds",this.data);	
};
StoryListAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('storyList'), Mojo.Event.listTap, this.tapped);
	Mojo.Event.stopListening(this.controller.get('storyList'), Mojo.Event.listDelete, this.feedDelete);	
	Mojo.Event.stopListening(this.controller.get('rightMenu'), Mojo.Event.tap, this.toggleDrawer);					
};
StoryListAssistant.prototype.validateUrl = function(url) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);					
};
StoryListAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		//verify url
		if(this.validateUrl(this.feedUrl))
				;
		else
		this.showUrlEditBox("Invalid Url", this.feedUrl + " is appears to be invalid. Would you like to change this url?")
	}
	else
		this.controller.stageController.popScene("storyList");
	},
		title:title,
		message:message,
		choices:[{label: 'Diagnose the problem', value:'yes', type:'affirmative'}, {label:'I know what I did wrong', value:'no', type:'negative'}]
	});	
}
StoryListAssistant.prototype.showUrlEditBox = function(title, message){
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		this.controller.showDialog({template: 'storyList/edit-dialog',assistant: new SampleDialogAssistant(this,this.feedTitle,this.feedUrl,this.data,language)});		
	}
	else
		this.controller.stageController.popScene("storyList");
	},
		title:title,
		message:message,
		choices:[{label: 'Yes', value:'yes', type:'affirmative'}, {label:'No', value:'no', type:'negative'}]
	});	
};
StoryListAssistant.prototype.spinOn = function(){
	this.scrim.show();   
};
StoryListAssistant.prototype.spinOff = function(){
	this.scrim.hide();
	if (this.stories == null) {
		for (k = 0; k < this.stories.length; k++) {
			this.data[index].stories = [];
		}
	}
	else {
		for (k = 0; k < this.stories.length; k++) {
			this.data[index].stories[k] = {
				title: this.stories[k].title,
				text: this.stories[k].text,
				headLine: this.stories[k].text.replace(/<\/?[^>]+(>|$)/g, ""),
				unreadStyle: this.stories[k].unreadStyle,
				unread: this.stories[k].unread,
				previewStyle: this.stories[k].previewStyle,
				url: this.stories[k].url,
				date: this.stories[k].date,
				description: this.stories[k].description
			};
		}
	}
};
var EditDialogAssistant = Class.create(
{
	initialize: function(sceneAssistant,feedTitle,feedUrl,arg,l) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
		this.data = [];
		this.tempItems;
		var language = "en";
		this.title = feedTitle;
		this.url = feedUrl;
		this.data = arg;
		language = l;
	},
	
	setup : function(widget) {
		this.widget = widget;
		var culture = "en";
		this.cookie = new Mojo.Model.Cookie('prefs')
		var cookieSettings = this.cookie.get();
		culture = cookieSettings.language;
		if(culture == "en")
		{
			this.controller.get('subDetailsTxt').update('Subscription details')
			var applyTxt = 'Apply Changes' 
			var removeBtn = 'Remove'
			var closeBtn = 'Close'	
		}	
		else if(culture == "de")
		{
			this.controller.get('subDetailsTxt').update('Abo-Details')
			var applyTxt = 'Uebernehmen'
			var removeBtn = 'Entfernen'
			var closeBtn = 'Schliessen'
		}	
		else if(culture == "fr")
		{
			this.controller.get('subDetailsTxt').update("d&eacute;tails de l'abonnement")
			var applyTxt = 'Appliquer'
			var removeBtn = 'Supprimer'
			var closeBtn = 'Fermer'	
		}	
		this.controller.get('editTitle').update(this.title);
		this.controller.get('applyBtn').update(applyTxt);
		this.controller.get('removeBtn').update(removeBtn);
		this.controller.get('closeBtn').update(closeBtn);
		this.handleClicked = this.handleClicked.bind(this);
		this.handleClicked2 = this.handleClicked2.bind(this);
		this.handleClicked3 = this.handleClicked3.bind(this);			
		Mojo.Event.listen(this.controller.get('applyBtn'),Mojo.Event.tap, this.handleClicked);
		Mojo.Event.listen(this.controller.get('removeBtn'),Mojo.Event.tap, this.handleClicked2);
		Mojo.Event.listen(this.controller.get('closeBtn'),Mojo.Event.tap, this.handleClicked3);
	},
	
	handleClose: function() {
		this.widget.mojo.close();
	},
	
	handleClicked: function(event){	
		for(i = 0;i<this.data.length;i++)
		{
			if (this.data[i].name == this.title)
			{
				this.data[i].number = this.controller.get('textField').mojo.getValue();
				
			}
		}	
	//save
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds",this.data);
	this.handleClose();
	this.controller.stageController.popScene('storyList');
	Mojo.Controller.stageController.pushScene({'name': 'storyList', sceneTemplate: 'storyList/storyList-scene',transition: Mojo.Transition.none},this.title,this.controller.get('textField').mojo.getValue(),this.data,language)
	},
	
	handleClicked3: function(event){	
		this.handleClose();
	},
	
	handleClicked2: function(event){	
		this.tempItems = [];
		if (this.data.length > 0) {
			for (i = 0; i < this.data.length; i++) {
				this.tempItems[i] = {
					'name': this.data[i].name,
					'number': this.data[i].number,
					'unreadCount': this.data[i].unreadCount,
					'stories': this.data[i].stories,
					'icon': 'feedlist-default',
				    'newestFeed': this.data[i].newestFeed,
				    'date': this.data[i].date,
				    'description': this.data[i].description
				}
			}
			for(i = 0;i<this.tempItems.length;i++)
		{
			if (this.data[i].name == this.title)
			{
				try {	
				this.data.splice(i,1)
				} catch (e) {	
				}
				
			}
		}
				this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
				this.feedDb.add("feeds", this.data);
				this.controller.stageController.popScene("storyList");
				this.handleClose();	
				this.controller.stageController.popScene('main');
				Mojo.Controller.stageController.pushScene({'name': 'main', sceneTemplate: 'main/main-scene',transition: Mojo.Transition.none})	
		}
	},
	
	dbFailure: function(transaction, result) {
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
	},
});