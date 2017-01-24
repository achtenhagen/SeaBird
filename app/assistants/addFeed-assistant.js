var duplicate = "";
var duplicateName = "";
this.data = [];
var language = "en";
var duplicateTitleTxt;
var duplicateBody;
var repoBodyTxt;
var yesBtn;
var noBtn;
function AddFeedAssistant(arg,l) {
	this.data = arg;	
	language = l;
}
AddFeedAssistant.prototype.setup = function() {
	this.controller.enableFullScreenMode(true);
	if(language == "en" || language == null)
	{
		this.controller.get('subDetailsTxt').update("Subscription Details");
		var urlBoxTxt = 'RSS or Atom Feed URL...'
		var categoryTxt = 'Category'
		var subTitleTxt = 'Subscription Title...'
		var addSubTxt = 'Add Subscription'
		var cancelBtn = 'Cancel'
		var browseTxt = 'Browse...'
		duplicateTitleTxt = "Duplicate found!"
		duplicateBody = "Would you like to edit this subscription?"
		repoBodyTxt = "Would you like to help Feed Discovery grow by submitting this feed to our database? (No personal information will be sent)."
		yesBtn = 'Yes'
		noBtn = 'No'
	}
	else if(language == "de")
	{
		this.controller.get('subDetailsTxt').update('Abo-Details');
		var urlBoxTxt = 'RSS oder Atom Feed URL...'
		var categoryTxt = 'Kategorie'
		var subTitleTxt = 'Abo Titel...'
		var addSubTxt = 'Abo Hinzufuegen'
		var cancelBtn = 'Abbrechen'
		var browseTxt = 'Suchen...'
		duplicateTitleTxt = "Abo existiert bereits!"
		duplicateBody = "Moechten Sie dieses Abonnement bearbeiten?"
		repoBodyTxt = "Moechten Sie die Feed Discovery Datenbank durch den Eintrag dieses Feeds erweitern? (keine persoenlichen Daten werden gesendet)."
		yesBtn = "Ja"
		noBtn = "Nein"
	}
	else if(language == "fr")
	{
		this.controller.get('subDetailsTxt').update("d&eacute;tails de l'abonnement");
		var urlBoxTxt = 'RSS ou Atom Feed URL...'
		var categoryTxt = 'Categorie'
		var subTitleTxt = "Titre de l'abonnement..."
		var addSubTxt = "Ajouter l'abonnement"
		var cancelBtn = 'Annuler'
		var browseTxt = 'Parcourir...'
		duplicateTitleTxt = "Dupliquer trouve!"
		duplicateBody = "Souhaitez-vous modifier cet abonnement?"
		repoBodyTxt = "Souhaitez-vous elargir la base de donnees RSS Decouverte par l'entree de cet aliment? (Aucune donnee personnelle ne sera envoyee)."
		yesBtn = 'Oui'
		noBtn = 'Non'
	}
	 this.attributes = {
           spacerHeight: 0,
           menuClass: 'no-fade'
        },
	this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:	[{},{},{label:(browseTxt), command:'search'}]});
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
				maxLength: 1000,
				requiresEnterKey: false
		};
		this.UrlModel = {
			'feedUrl' : '',
			disabled: false
		};

		this.controller.setupWidget('textField', UrlAttributes, this.UrlModel);
		var TitleAttributes = {
				hintText: subTitleTxt,
				textFieldName:	'nameField',  
				multiline:		false,
				disabledProperty: 'disabled',
				modelProperty:		'feedTitle',
				focus: 			false, 
				modifierState: 	Mojo.Widget.capsLock,
				limitResize: 	false, 
				holdToEnable:  true, 
				focusMode:		Mojo.Widget.focusSelectMode,
				changeOnKeyPress: true,
				textReplacement: false,
				maxLength: 100,
				requiresEnterKey: false
		};
		this.TitleModel = {
			'feedTitle' : '',
			disabled: false
		};
		this.controller.setupWidget('nameField', TitleAttributes, this.TitleModel);
		this.controller.setupWidget('confirmFeed', 
				this.atts = {
					type: Mojo.Widget.activityButton
					}, 
				this.model = {
					buttonLabel: addSubTxt,
					buttonClass: 'affirmative',
					disabled: false,
				});
				this.controller.setupWidget('cancelFeed', 
				this.atts = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model = {
					buttonLabel: cancelBtn,
					buttonClass: 'default',
					disabled: false
				});
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
				{label: $L('Wallpaper'), value: 26},
		], 

		modelProperty:'firstValue' 
	},
	this.firstModel = {
		'firstValue': 'Other' 
	}
		this.controller.setupWidget('firstSelector', this.firstAttributes, this.firstModel);
		this.controller.setupWidget('web-view', {url:''});
		this.drawerModel = {myOpenProperty:false};
		this.controller.setupWidget('Drawer', {property:'myOpenProperty'}, this.drawerModel);
		this.handleClicked = this.handleClicked.bind(this);
		this.handleClicked2 = this.handleClicked2.bind(this);
		this.validateUrl = this.validateUrl.bind(this);
		Mojo.Event.listen(this.controller.get('confirmFeed'), Mojo.Event.tap, this.handleClicked);
		Mojo.Event.listen(this.controller.get('cancelFeed'), Mojo.Event.tap, this.handleClicked2);
		Mojo.Event.listen(this.controller.get('textField'), Mojo.Event.propertyChange, this.propertyChanged);
		Mojo.Event.listen(this.controller.get('nameField'), Mojo.Event.propertyChange, this.propertyChanged);
};
AddFeedAssistant.prototype.handleClose = function(event) {
	this.controller.stageController.popScene("addFeed");
};
AddFeedAssistant.prototype.validateUrl = function(url) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);					
};
AddFeedAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'search':
				this.controller.stageController.popScene("addFeed");
			this.controller.stageController.pushScene("live",this.data,language);
		break;
		}
	}
};
AddFeedAssistant.prototype.checkFailure = function(transport){}
AddFeedAssistant.prototype.processFeed = function(transport){
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
};
AddFeedAssistant.prototype.checkSuccess = function(transport){
	try {
			if (transport.responseXML === null && transport.responseText !== null) {
            transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
     }
    var feedError = this.errorNone;
    feedError = this.processFeed(transport);                 
    if (feedError === this.errorNone) {
		if (this.validateUrl(this.UrlModel['feedUrl']) == true) {
			if (this.data == null) {
				this.data[0] = {
					'name': this.TitleModel['feedTitle'],
					'number': this.UrlModel['feedUrl'],
					'unreadCount': 0,
					'stories': [],
					'icon': 'feedlist-default',
					'newestFeed': ""
				}
			}
			else {
				var exists = false;
				for (x = 0; x < this.data.length; x++) {
					if (this.data[x].number == this.UrlModel['feedUrl']) {
						exists = true;
						duplicate = this.data[x].number
						duplicateName = this.data[x].name;
					}
				}
				if (exists == false) {
					this.data[this.data.length] = {
						'name': this.TitleModel['feedTitle'],
						'number': this.UrlModel['feedUrl'],
						'unreadCount': 0,
						'stories': [],
						'icon': 'feedlist-default',
						'newestFeed': ""
					}
				}
				else 
					if (exists == true) {
						this.showDialogBox(duplicateTitleTxt, duplicateBody)
					}
				
			}
			if (exists == false) {
				this.feedDb = new Mojo.Depot({
					name: "ext:feedDb",
					replace: false
				});
				this.feedDb.add("feeds", this.data);
				this.controller.showAlertDialog({
					onChoose: function(value){
						if (value == 'yes') {
							if (this.TitleModel['feedTitle'].length > 0) {
								this.controller.get('web-view').mojo.openURL("http://fioware.com/seaBird/add_feed.php?name=" + this.TitleModel['feedTitle'] + "&url=" + this.UrlModel['feedUrl'] + "&cat=" + this.firstModel['firstValue'])
								window.setTimeout(this.handleClose.bind(this), 3000);
							}
							
						}
						else 
							this.controller.stageController.popScene("addFeed");
					},
					title: "Feed Discovery",
					message: repoBodyTxt,
					choices: [{
						label: yesBtn,
						value: 'yes',
						type: 'affirmative'
					}, {
						label: noBtn,
						value: 'no',
						type: 'negative'
					}]
				});
			}
		}
		else {
			this.controller.showAlertDialog({
				onChoose: function(value){
				},
				title: "Invalid Url",
				message: this.UrlModel['feedUrl'] + " is not a valid http url.",
				choices: [{
					label: 'OK',
					value: 'OK',
					type: 'color'
				}]
			});
		}
	}
		} catch (e) {
	this.showDialogBox("",e.message);
}
};
AddFeedAssistant.prototype.handleClicked = function(event){
	if (this.TitleModel['feedTitle'].length >= 1 && this.UrlModel['feedUrl'].length >= 1) {
		var request = new Ajax.Request(this.feedUrl, {
                	method: "get",
                	evalJSON: "false",
                	onSuccess: this.checkSuccess.bind(this),
                	onFailure: this.checkFailure.bind(this)
            		});
	}
}
AddFeedAssistant.prototype.callback = function(value) {

}
AddFeedAssistant.prototype.handleClicked2 = function(event){
	this.controller.stageController.popScene("addFeed");
}
AddFeedAssistant.prototype.activate = function(event) {
};

AddFeedAssistant.prototype.deactivate = function(event) {

};

AddFeedAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('confirmFeed'), Mojo.Event.tap, this.handleClicked);
	Mojo.Event.stopListening(this.controller.get('cancelFeed'), Mojo.Event.tap, this.handleClicked);
	Mojo.Event.stopListening(this.controller.get('textField'), Mojo.Event.propertyChange, this.propertyChanged); 
	Mojo.Event.stopListening(this.controller.get('nameField'), Mojo.Event.propertyChange, this.propertyChanged); 
};
AddFeedAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{
		this.controller.stageController.popScene("addFeed");
		this.controller.stageController.pushScene("editFeed",duplicateName,this.UrlModel['feedUrl'])
	}},
		title:title,
		message:message,
		choices:[{label: yesBtn, value:'yes', type:'affirmative'}, {label:noBtn, value:'no', type:'negative'}]
	});	
}
AddFeedAssistant.prototype.dbFailure = function(transaction, result) {
	console.log("***** depot failure: " + result.message);
	this.showDialogBox("Error",result.message);
};