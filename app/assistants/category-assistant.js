this.data = [];
this.catTitle = "";
this.feedTitle;
this.feedURL;
this.feeds;
var msgBody;
var language = "en";
var yesBtn;
var noBtn;
var duplicateTitleTxt;
var duplicateTitleBody;
var openStatus = false;
function CategoryAssistant(title,args,l) {
	this.data = [];
	this.data = args;
	this.catTitle = title;
	language = l;
};
CategoryAssistant.prototype.setup = function(){
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024)
	{
		this.controller.enableFullScreenMode(false);
		this.attributes = {spacerHeight: 0, menuClass: 'no-fade'};
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:[{icon: 'back', command: 'back'},{},{icon: 'search', command: 'search'}]});
	}
	else
		this.controller.enableFullScreenMode(true);
	this.controller.get('category-title').update(this.catTitle);
	if(language == "en" || language == null)
	{
		msgBody = "Would you like to Subscribe to this feed?"
		yesBtn = 'Yes';
		noBtn = 'No, Thanks';
		duplicateTitleTxt = 'Duplicate found!'
		duplicateTitleBody = 'You are already subscribed to '
	}
	else if(language == "de")
	{
		msgBody = "Moechten Sie diesen feed abonnieren?"
		yesBtn = 'Ja'
		noBtn = 'Nein, Danke'
		duplicateTitleTxt = "Abo existiert bereits!"
		duplicateTitleBody = 'Sie haben diesen feed bereits abonniert: '
	}
	else if (language == "fr")
	{
		msgBody = "Souhaitez-vous Abonnez-vous à ce fil de nouvelles?"
		yesBtn = 'Oui'
		noBtn = 'Non, Merci'
		duplicateTitleTxt = "Dupliquer trouve!"
		duplicateTitleBody = 'Vous etes deja abonne a '
	}
	this.controller.setupWidget("filterlist", {
		itemTemplate: 'category/entry',
		swipeToDelete: false,
		reorderable: false,
		formatters:{name:this.formatName.bind(this),url:this.formatNumber.bind(this)},
		filterFunction: this.list.bind(this),
		delay: 500,
		disabledProperty: 'disabled'	
	});
	this.gotFilter = this.gotFilter.bind(this);
	this.filterlist = this.controller.get('filterlist');
	this.tapped = this.tapped.bindAsEventListener(this);
	this.resetScroll = this.resetScroll.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('filterlist'), Mojo.Event.listTap, this.tapped);
	Mojo.Event.listen(this.controller.get('filterlist'), Mojo.Event.filter, this.gotFilter, true);
	Mojo.Event.listen(this.controller.get('storyTitle'), Mojo.Event.tap, this.resetScroll);
};
CategoryAssistant.prototype.resetScroll = function()
{
	this.controller.get('filterlist').mojo.revealItem(0,true);
};
CategoryAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'back':
				this.controller.stageController.popScene();
			break;
			case 'search':
				if(openStatus == false)
				{
					openStatus = true;
					this.controller.get('filterlist').mojo.open();
				}
				else
				{
					openStatus = false;
					this.controller.get('filterlist').mojo.close();
				}
					
			break;
		}
	}
};
CategoryAssistant.prototype.tapped = function(event){
	if(openStatus = true)
	{
		openStatus = false;
		this.controller.get('filterlist').mojo.close();
	}
		
	this.feedTitle = event.item.name;
	this.feedURL = event.item.url;
	var message = msgBody;
	if(event.item.style == 'readStyle')
	{
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:'',
		message:duplicateTitleBody + this.feedTitle + ".",
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
	}
	else{
	this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		event.item.style = 'readStyle'
		this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
		this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));	
		var request = new Ajax.Request("http://fioware.com/seabird/subscribe.php?url=" + event.item.url, {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
	}
	else
		;
	},
		title:this.feedTitle,
		message:message,
		allowHTMLMessage:true,
		choices:[{label: yesBtn, value:'yes', type:'affirmative'}, {label:noBtn, value:'no', type:'negative'}]
	});
	}	
};
CategoryAssistant.prototype.showDialogBox = function(title,message){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}
CategoryAssistant.prototype.dbSuccess = function(settings){
	this.feeds = [];
	this.feeds = settings;
	var exists = false;
		for(i=0;i < this.feeds.length;i++)
	{
		if (this.feeds[i].number == this.feedURL)
			exists = true;
		else
		;
	}
	if(exists == false)
	{
		this.feeds[this.feeds.length] = {
			'name': this.feedTitle,
			'number': this.feedURL,
			'unreadCount': 0,
			'stories': [],
			'icon': 'feedlist-default',
			'newestFeed': ""
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
		choices:[ {label:'OK', value:'OK', type:'color'}]});
	}
};
CategoryAssistant.prototype.checkSuccess = function(event){};
CategoryAssistant.prototype.checkFailure = function(event){};
CategoryAssistant.prototype.dbFailure = function(transaction, result) {}
CategoryAssistant.prototype.formatName = function(n, model){
		return n;
};
CategoryAssistant.prototype.formatNumber = function(n, model){
		return n;
};
CategoryAssistant.prototype.formatCount = function(n, model){
		return String(n).capitalize();
};
CategoryAssistant.prototype.gotFilter = function(event) {
};
CategoryAssistant.prototype.list = function(filterString, listWidget, offset, count){
	var subset = [];
		var totalSubsetSize = 0;
		var i = 0;
		while (i <  this.data.length) {
			
	        if (this.data[i].name.include(filterString) ||
	            this.data[i].url.include(filterString)) {
				if (subset.length < count && totalSubsetSize >= offset) {
					subset.push(this.data[i]);
				}
				totalSubsetSize++;
			}
			i++;
		}
		
		listWidget.mojo.noticeUpdatedItems(offset, subset);
		
		if (this.filter !== filterString) {
			listWidget.mojo.setLength(totalSubsetSize);
			listWidget.mojo.setCount(totalSubsetSize);
		}
		this.filter = filterString;
	};
CategoryAssistant.prototype.activate = function(event) {
	
};

CategoryAssistant.prototype.deactivate = function(event) {
	
};

CategoryAssistant.prototype.cleanup = function(event) {};
