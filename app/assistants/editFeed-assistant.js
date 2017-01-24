this.data = [];
this.tempItems;
var language = "en";
function EditFeedAssistant(feedTitle,feedUrl,arg,l) {
	this.title = feedTitle;
	this.url = feedUrl;
	this.data = arg;
	language = l;
}

EditFeedAssistant.prototype.setup = function() {
this.controller.enableFullScreenMode(true);
	if(language == "en" || language == null)
	{
		this.controller.get('group1Text').update('Subscription details')
		var applyTxt = 'Apply Changes' 
		var removeBtn = 'Remove'
		var closeBtn = 'Close'
	}
	else if(language == "de")
	{
		this.controller.get('group1Text').update('Abo-Details')
		var applyTxt = 'Uebernehmen'
		var removeBtn = 'Entfernen'
		var closeBtn = 'Schliessen'
	}
	else if(language == "fr")
	{
		this.controller.get('group1Text').update("d&eacute;tails de l'abonnement")
		var applyTxt = 'Appliquer'
		var removeBtn = 'Supprimer'
		var closeBtn = 'Fermer'
	}
this.controller.get('title').update(this.title);
var UrlAttributes = {
				hintText: 'RSS Feed URL...',
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
			'feedUrl' : this.url,
			disabled: false
		};
		this.controller.setupWidget('textField', UrlAttributes, this.UrlModel);
		this.controller.setupWidget('button-2', 
				this.atts = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model = {
					buttonLabel: applyTxt,
					buttonClass: 'affirmative',
					disabled: false
				});
		this.controller.setupWidget('button-3', 
				this.atts = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model = {
					buttonLabel: closeBtn,
					buttonClass: 'default',
					disabled: false
				});
		this.controller.setupWidget('button-4', 
				this.atts = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model = {
					buttonLabel: removeBtn,
					buttonClass: 'negative',
					disabled: false
				});
	this.handleClicked = this.handleClicked.bind(this);
	this.handleClicked2 = this.handleClicked2.bind(this);
	this.handleClicked3 = this.handleClicked3.bind(this);			
	Mojo.Event.listen(this.controller.get('button-2'),Mojo.Event.tap, this.handleClicked);
	Mojo.Event.listen(this.controller.get('button-3'),Mojo.Event.tap, this.handleClicked2);
	Mojo.Event.listen(this.controller.get('button-4'),Mojo.Event.tap, this.handleClicked3);
};
EditFeedAssistant.prototype.handleClicked = function(event){
	for(i = 0;i<this.data.length;i++)
		{
			if (this.data[i].name == this.title)
			{
				this.data[i].number = this.UrlModel['feedUrl'];
				
			}
		}	
	//save
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds",this.data);
	this.controller.stageController.popScene("editFeed");
	this.controller.stageController.popScene("first");
	this.controller.stageController.pushScene("first", this.data);
}
EditFeedAssistant.prototype.handleClicked2 = function(event){
this.controller.stageController.popScene("editFeed");	
}
EditFeedAssistant.prototype.handleClicked3 = function(event){	
		this.tempItems = [];
		if (this.data.length > 0) {
			for (i = 0; i < this.data.length; i++) {
				this.tempItems[i] = {
					'name': this.data[i].name,
					'number': this.data[i].number,
					'unreadCount': this.data[i].unreadCount,
					'stories': this.data[i].stories,
					'icon': 'feedlist-default',
				    'newestFeed': this.data[i].newestFeed
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
				this.controller.stageController.popScene("editFeed");	
				this.controller.stageController.popScene("main");
				this.controller.stageController.pushScene("main", this.data);	
		}
}
EditFeedAssistant.prototype.activate = function(event) {
};

EditFeedAssistant.prototype.deactivate = function(event) {
};

EditFeedAssistant.prototype.cleanup = function(event) {
Mojo.Event.stopListening(this.controller.get('button-2'),Mojo.Event.tap, this.handleClicked);
Mojo.Event.stopListening(this.controller.get('button-3'),Mojo.Event.tap, this.handleClicked2);
Mojo.Event.stopListening(this.controller.get('button-4'),Mojo.Event.tap, this.handleClicked3);
};
EditFeedAssistant.prototype.showDialogBox = function(title,message){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}
