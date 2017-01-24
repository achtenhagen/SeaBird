this.data = [];
this.categories = [];
var catCount = 0;
this.feeds = [];
var language = "en";
this.feedURL;
this.feedTitle;
var msgBody;
var yesBtn;
var noBtn;
var duplicateTitleTxt;
var duplicateTitleBody;
var updateBtn = 'Update';
var updateTime;
var currentTime = new Date();
var month = currentTime.getMonth() + 1;
var day = currentTime.getDate();
var hours = currentTime.getHours()
var minutes = currentTime.getMinutes()
var time;
var timeOfDay;
var year = currentTime.getFullYear();	
function LiveAssistant(args,l) {
	this.data = args;
	language = l
}
LiveAssistant.prototype.setup = function(){
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024){
		this.controller.enableFullScreenMode(false);
		document.getElementById('large-activity-spinner').style.marginTop = "50%";
	}
	else
		this.controller.enableFullScreenMode(true);
	if(language == "en" || language == null)
	{
		msgBody = "Would you like to Subscribe to this feed?"
		yesBtn = 'Yes';
		noBtn = 'No, Thanks';
		duplicateTitleTxt = 'Duplicate found!'
		duplicateTitleBody = 'You are already subscribed to '
		var updateBtn = 'Update'
		var categoryLabel = "All Categories"
		var mostRecentLabel = 'New'
		var aboutBtn = "About"
		var topFeeds = 'Top'
	}
	else if(language == "de")
	{
		msgBody = "Moechten Sie diesen feed abonnieren?"
		yesBtn = 'Ja'
		noBtn = 'Nein, Danke'
		duplicateTitleTxt = "Abo existiert bereits!"
		duplicateTitleBody = 'Sie haben diesen feed bereits abonniert: '
		var updateBtn = 'Aktualisieren'
		var categoryLabel = "Alle Kategorien"
		var mostRecentLabel = 'Neu'
		var aboutBtn = "Info"
		var topFeeds = 'Top'
	}
	else if (language == "fr")
	{
		msgBody = "Souhaitez-vous Abonnez-vous à ce fil de nouvelles?"
		yesBtn = 'Oui'
		noBtn = 'Non, Merci'
		duplicateTitleTxt = "Dupliquer trouve!"
		duplicateTitleBody = 'Vous etes deja abonne a '
		var updateBtn = "Mise a jour"
		var categoryLabel = "Categories"
		var mostRecentLabel = "Nouvelles"
		var aboutBtn = "Infos"
		var topFeeds = 'Top'
	}
	if (minutes < 10){
			minutes = "0" + minutes
			}
		time = hours + ":" + minutes + " "
		if(hours > 11){
			timeOfDay = " PM"
		} else {
			timeOfDay = " AM" 
		}
	updateTime = time + timeOfDay;
	this.attributes = {
           menuClass: 'no-fade'
        }
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024) {
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {
			items: [{icon: 'back', command: 'back'},{icon: 'sync', command: 'update'},{icon: 'info', command: 'about'}]});
	}
	else
	{
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {
			items: [{
				label: $L(updateBtn),command: 'update'},{},{label: $L(aboutBtn), command: 'about'}]
		});
	}

	this.controller.setupWidget("catList",
         {
            itemTemplate:"live/listitem", 
            listTemplate:"live/listcontainer", 
            swipeToDelete:false, 
            renderLimit: 30,
            reorderable:false
        }, this.catModel = {items: this.categories});
	this.exampleSpinner = 'example-activity-spinner',
	this.spinnerAttrs = {
		spinnerSize: Mojo.Widget.spinnerLarge,
		property: 'spinning1'
	}	
		this.spinnerModel = {
			spinning1: true
		};
	this.exampleSpinner = 'large-activity-spinner';	
	this.controller.setupWidget('large-activity-spinner', this.spinnerAttrs, this.spinnerModel);
	this.scrim = Mojo.View.createScrim(this.controller.document, {onMouseDown:this.close.bind(this), scrimClass:'palm-scrim'});
	this.controller.get("scrim").appendChild(this.scrim).appendChild($(this.exampleSpinner));
	this.controller.setupWidget(Mojo.Menu.viewMenu, this.attributes, {items: [ {label: $L('All'), toggleCmd:'all', items:[{},
	{label: $L(topFeeds), toggleCmd:'top', command:'top'},{label: $L(categoryLabel), command:'all'}, {label: $L(mostRecentLabel), command:'pop'},{}]}]});
	this.setupModel();
	this.resetScroll = this.resetScroll.bind(this);
	this.tapped = this.tapped.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('catList'), Mojo.Event.listTap, this.tapped);
};
LiveAssistant.prototype.close =  function(e){};
LiveAssistant.prototype.open =  function(e){
		this.scrim.show();
};
LiveAssistant.prototype.resetScroll = function(event){
	this.controller.get('catList').mojo.revealItem(0,true)
};
LiveAssistant.prototype.tapped = function(event) {
	if(this.categories[event.index].count == 0)
		this.showDialogBox("No feeds available","There are currently no feeds available in this category.")
	else if(event.item.icon == 'feedlist-cat')
	{
		this.feedTitle = event.item.name;
		var request = new Ajax.Request('http://fioware.com/seabird/repo.php?cat=' + event.index, {
	    	method: "get",
	    	evalJSON: "true",
	    	onSuccess: this.checkCategorySuccess.bind(this),
	    	onFailure: this.checkFailure.bind(this)});
	}
	else if(event.item.icon == 'feedlist-new')
	{
		this.feedTitle = event.item.name;
		this.feedURL = event.item.description;
		var message = msgBody;
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
		this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));		
		var request = new Ajax.Request("http://fioware.com/seabird/subscribe.php?url=" + event.item.description, {method: "get",evalJSON: "false"});	
	}
	},
		title:this.feedTitle,
		message:message,
		choices:[{label: yesBtn, value:'yes', type:'affirmative'}, {label:noBtn, value:'no', type:'negative'}]
	});	
	}
};
LiveAssistant.prototype.checkCategorySuccess = function(transport){
	this.repoDatabase = [];
	this.feeds = [];
	this.repoDatabase = transport.responseText.evalJSON();
		for(k=0;k<this.repoDatabase.length;k++)
		{
			for(i=0;i<this.data.length;i++)
			{
				if(this.data[i].number.toUpperCase() == this.repoDatabase[k].url.toUpperCase())
				{
					this.feeds[k] = {
							name: this.repoDatabase[k].name,
							cat: this.repoDatabase[k].cat,
							url: this.repoDatabase[k].url,
							dlc: this.repoDatabase[k].dlc,
							style: 'readStyle',
							icon: 'feedlist-grey'
					}
				}
				else
				{
					this.feeds[k] = {
							name: this.repoDatabase[k].name,
							cat: this.repoDatabase[k].cat,
							url: this.repoDatabase[k].url,
							dlc: this.repoDatabase[k].dlc,
							style: 'unreadStyle',
							icon: 'feedlist-default'
					}
				}
			}
		}
	Mojo.Controller.stageController.pushScene({'name': 'category', sceneTemplate: 'category/category-scene',transition: Mojo.Transition.crossFade},this.feedTitle,this.feeds,language)
};
LiveAssistant.prototype.dbSuccess = function(settings){
	this.feeds = [];
	this.feeds = settings;
	if(settings != null)
	{
		var exists = false;
			for(i=0;i < this.feeds.length;i++)
		{
			if (this.feeds[i].number == this.feedURL)
				exists = true;
		}
		if(exists == false)
		{
			this.feeds[this.feeds.length] = {
				'name': this.feedTitle,
				'number': this.feedURL,
				'unreadCount': 0,
				'stories': [],
				'icon': 'feedlist-default',
				'newestFeed': "",
				'description': ''
			}
			this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
			this.feedDb.add("feeds", this.feeds);
		}
		else
		{
			this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:duplicateTitleTxt,
			message:duplicateTitleBody + this.feedTitle,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
		}
    }
};
LiveAssistant.prototype.dbFailure = function(transaction, result) {}
LiveAssistant.prototype.checkTopFeedsSuccess = function(transport){
	this.topItems = [];
	this.tempItems = [];
	this.tempItems = transport.responseText.evalJSON();
	for(i=0;i<this.tempItems.length;i++)
	{
		this.topItems[i] = {
			'name': this.tempItems[i].name,
			'description': this.tempItems[i].url,
			'icon': 'feedlist-new'
		}
	}
	
	this.catModel.items = [];
	this.catModel.items = this.topItems;
	this.controller.modelChanged(this.catModel);
}
LiveAssistant.prototype.checkTopFeedsFailure = function(){}
LiveAssistant.prototype.setupTopFeeds = function(event){
	var request = new Ajax.Request("http://fioware.com/seabird/top.php", {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkTopFeedsSuccess.bind(this),
                	onFailure: this.checkTopFeedsFailure.bind(this)
            		});	
}
LiveAssistant.prototype.setupMostRecent = function(){
	var request = new Ajax.Request("http://fioware.com/seabird/new.php", {
    	method: "get",
    	evalJSON: "false",
    	onSuccess: this.checkNewFeedsSuccess.bind(this),
    	onFailure: this.checkTopFeedsFailure.bind(this)
		});	
};
LiveAssistant.prototype.checkNewFeedsSuccess = function(transport){
	this.catModel.items = [];
	this.recentItems = [];
	this.tempItems = [];
	this.tempItems = transport.responseText.evalJSON();
	for(i=0;i<this.tempItems.length;i++)
	{
		this.recentItems[i] = {
		'name': this.tempItems[i].name,
		'description': this.tempItems[i].url,
		'icon': 'feedlist-new'				
		}
	}
	this.catModel.items = this.recentItems;       
	this.controller.modelChanged(this.catModel);	
};
LiveAssistant.prototype.setupModel = function(){
	this.categories = [{
		'name': 'Arts & Entertainment',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Design, Decorative, Fashion, Fine Art, Modern Art, Photography',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Auto & Truck',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Auto Repair, Formula 1, RC Cars, Sports Cars, Trucks, Vehicles',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Books & Magazines',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Authors, Bestsellers, eBooks, Kindle, Novels, Publishers',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Business & Finance',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Banking, Employment, Financing, Marketing, Stocks, Welfare',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Celebrities',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Actors, Actresses, Athletes, Models, Singers, TV, Writers',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Culture',	
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Foods, Housing, Language, People, Tribes, Traditions, World',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Education',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Colleges, Communication, Math, Schools, Students, Teachers',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Environment',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Climate Change, Global Warming, Energy, Nature, Recycling, Weather',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Health & Lifestyle',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Fitness, Foods, Healthy Living, Hobbies, Weight Loss, Workouts',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'How To',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Blogs, eHow, Guides, Tutorials, Videos, WikiHow, YouTube',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Law',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Jurists, Lawyers, Legal Organizations, Legal Terms, Rights',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Music',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Albums, Artists, Concerts, Lyrics, Top of the Charts, Vocals',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Other',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Various Items',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},{
		'name': 'Palm',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Events, HP, Palm Pixi, Palm Pre, Pre Central, webOS 2.0',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Politics',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Government, Political culture, Political theories, U.S Politics',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Programming',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'ASP .Net, C#, C++, HTML, Java, PHP, Python, Visual Basic',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Religion',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Atheists, Beliefs, Bible, Christianity, Churches, Cults, Islam',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Science',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Animals, Astronomy, Chemistry, Earth and Space, Humanity, Physics',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Shopping',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Amazon, eBay, Coupons, Gifts, Hot Deals, Pets, Supplies, Toys, Weddings',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Social',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Blogging, Dating, Events, Facebook, MySpace, Twitter',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Sports',	
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Basketball, Cycling, Football, Olympics, Racing, Soccer, Swimming',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Technology',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Computers, Gadgets, Phones, Robots, Software, Television',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Travel',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Airports, Cruises, Hotels, Last Minute Flights, Transportation',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'Video Games',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'PC Games, PlayStation, Nintendo DS, Sony, Xbox 360, Wii',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},
	{
		'name': 'World',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Culture, Disasters, Economy, History, News, Politics, Religion',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},{
		'name': 'Bit Torrent',		
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'P2P File Sharing, Latest Torrents, News',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	},{
		'name': 'Wallpaper',
		'count': 0,
		'icon': 'feedlist-cat',
		'description': 'Various Items',
		'badge': 'feedlist-newbadge',
		'dashboard': 'dashboard-newitem'
	}
	]
		this.reload();
}
LiveAssistant.prototype.activate = function(event) {

};
LiveAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'update':
					this.scrim.show();
					this.resetScroll();
					this.reload();
				break;
			case 'about':
					 this.controller.showAlertDialog({
                            onChoose: function(value) {},                            
                            title: $L("<table><tr><td style='border-collapse:collapse;'><img src='images/repo.png' /></td><td style='vertical-align:text-top;border-collapse:collapse;padding-top:3px;padding-left:4px;'>Feed Discovery</td></tr></table>"),
                            message: $L("Total Feeds: " + "<b>" + catCount + "</b><br />Updated @: <b>" +  updateTime + "</b><br />Version: <b>2.0</b><br />&copy; 2011 fioware.com. All rights reserved."),
							allowHTMLMessage:true,
                            choices:[{label:$L("Close"), value:"", type:"default"}]
                            });
				break;
		 	case 'pop':
				this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
				this.resetScroll();
				this.setupMostRecent();
				break;
			case 'all':
			this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
			this.resetScroll();
			this.setupModel();
			break;
			case 'top':
				this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
				this.resetScroll();
				this.setupTopFeeds();
			break;
			case "back":
				this.controller.stageController.popScene();
			break;
		}
	}
};
LiveAssistant.prototype.reload = function(){
			this.catModel.items = [];      
   			this.controller.modelChanged(this.catModel);  
			var request = new Ajax.Request('http://fioware.com/seabird/count.php', {
                	method: "get",
                	evalJSON: "true",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)});			
};
LiveAssistant.prototype.checkSuccess = function(transport){	
	this.repoCount = [];
	this.repoCount = transport.responseText.evalJSON();	
	catCount = 0;
	for(i=0;i<this.categories.length;i++)
	{
		this.categories[i].count = this.repoCount[i];
		catCount += this.repoCount[i];
	}
	this.catModel.items = this.categories;       
   	this.controller.modelChanged(this.catModel);
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var time;
	var timeOfDay;
	var year = currentTime.getFullYear();
		if (minutes < 10)
			minutes = "0" + minutes;
		time = hours + ":" + minutes + " ";
		if(hours > 11)
			timeOfDay = " PM";
		 else 
			timeOfDay = " AM"; 
	updateTime = time + timeOfDay;
	this.scrim.hide();	
};
LiveAssistant.prototype.showDialogBox = function(title,message){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}
LiveAssistant.prototype.checkFailure = function(event) {
	catCount = 0;	
	this.scrim.hide();
};
LiveAssistant.prototype.deactivate = function(event) {

};

LiveAssistant.prototype.cleanup = function(event) {
Mojo.Event.stopListening(this.controller.get('catList'), Mojo.Event.listTap, this.tapped);
};
