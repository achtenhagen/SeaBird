var rotationValue = true;
var coverFlowEnabled = false;
var vibrationEnabled = false;
var notify = true;
var notificationDisabled = false;
var shakeEnabled = false;
var interval = "00:15:00";
var resetMode = false;
var language = "en";
var revertTitleTxt;
var revertBodyTxt;
var resetBtnTxt;
var cancelBtnTxt;
var cacheBtnBody;
var notificationTitle;
var notificationMsg;
var SyncTitleText;
var syncLabel;
var credentialLabel;
var restartTitle;
var restartMsg;
var yesBtn;
var noBtn;
this.data = [];
function PreferencesAssistant(arg,l) {
	try 
	{
		this.data = arg;
		language = l;
	} catch (e) {
		language = "en";
	}
}
PreferencesAssistant.prototype.setup = function() {
if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024)
	this.controller.enableFullScreenMode(false);
else
	this.controller.enableFullScreenMode(true);
	if(language == null)
		language = "en";
	try 
	{
		this.cookie = new Mojo.Model.Cookie('prefs')
		var cookieSettings = this.cookie.get();
		language = cookieSettings.language
		rotationValue = cookieSettings.rotation;
		interval = cookieSettings.interval;
		shakeEnabled = cookieSettings.shake;	
		coverFlowEnabled = cookieSettings.coverFlow
		vibrationEnabled = cookieSettings.vibration
	} catch (e) {
		rotationValue = false;
		language = "en";
		interval = "00:15:00";
		shakeEnabled = false;
		coverFlowEnabled = false;
		vibrationEnabled = false;
	}
	if(interval == "00:00:00")
	{
		notify = false;
		notificationDisabled = true;
	}	
	else
	{
		notify = true;
		notificationDisabled = false;
	}	
	if(interval == null)
		interval = "00:00:00"
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024){
		this.attributes = {spacerHeight: 0, menuClass: 'no-fade'};
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:[{icon: 'back', command: 'back'},{},{}]});
	}		
	this.controller.get('appVersion').update("Version: " + Mojo.appInfo.version + " (Guava)");
	if(language == "en" || language == null)
	{
		this.controller.get('group1Text').update('User Interface')
		var languageTxt = 'Language'
		this.controller.get('group2Text').update('Screen Rotation')
		var trueLabelTxt = "On"
		var falseLabelTxt = "Off"
		this.controller.get('shakeReloadText').update('Shake to Reload')
		var cacheBtn = 'Clear Cache'
		var defaultBtn = 'Default Settings'
		var noneTxt = "None";
		revertTitleTxt = "Revert all settings to default?"
		revertBodyTxt = "This action cannot be undone. All of your data will be erased."
		resetBtnTxt = 'Reset to default'
		cancelBtnTxt = 'Cancel'
		cacheBtnBody = "Your Cache has been cleared."
		this.controller.get('notifyTitleText').update('Notification Settings');
		this.controller.get('notificationLabel').update('Notifications');
		var intervalLabel = "Interval"
		var manualUpdates = "Manual Updates"
		var minutesLabel = "Minutes"
		var hourlyLabel = "Hourly"
		var hoursLabel = "Hours"
		var dayLabel = "Day"
		notificationTitle = "Notifications"
		notificationMsg = 'Notifications are now turned on. This option may reduce battery life.'
		SyncTitleText = "Synchronization"
		syncLabel = "Cloud Sync"
		credentialLabel = "Save Credentials"
		restartTitle = "Language Changed"
		restartMsg = "Would like to restart Sea Bird now?"
		yesBtn = "Yes"
		noBtn = "No"
	}
	else if(language == "de")
	{
		this.controller.get('group1Text').update('Benutzeroberfl&auml;che')
		var languageTxt = 'Sprache'
		this.controller.get('group2Text').update('Bildschirm-Orientierung')
		this.controller.get('shakeReloadText').update('Shake to Reload')
		var trueLabelTxt = "Ein"
		var falseLabelTxt = "Aus"
		var cacheBtn = "Cache Leeren"
		var defaultBtn = 'Standardeinstellungen'
		var noneTxt = "Keine";
		revertTitleTxt = "Einstellungen zurueck setzten?"
		revertBodyTxt = "Diese Aktion kann nicht rueckgaengig gemacht werden. Alle Ihre Daten werden geloescht."
		resetBtnTxt = "Zurueck Setzten"
		cancelBtnTxt = 'Abbrechen'
		cacheBtnBody = "Ihr Cache wurde geleert."
		this.controller.get('notifyTitleText').update('Benachrichtigungen Einstellungen');
		this.controller.get('notificationLabel').update('Benachrichtigungen');
		var intervalLabel = "Intervall"
		var manualUpdates = "Manuelle Updates"
		var minutesLabel = "Minuten"
		var hourlyLabel = "Stuendlich"
		var hoursLabel = "Stunden"
		var dayLabel = "Tag"
		notificationTitle = "Benachrichtigungen"
		notificationMsg = 'Benachrichtigungen sind jetzt eingeschaltet. Diese Option kann die Akkulebensdauer vermindern.'
		restartTitle = "Sprachen Aenderung"
		restartMsg = "Moechten Sie Sea Bird jetzt neustarten?"
		yesBtn = "Ja"
		noBtn = "Nein"
	}
	else if(language == "fr")
	{
		this.controller.get('group1Text').update("Interface Utilisateur")
		var languageTxt = 'Langue';
		this.controller.get('group2Text').update("Rotation de l'&eacute;cran")
		this.controller.get('shakeReloadText').update('Shake to Reload')
		var trueLabelTxt = "Oui"
		var falseLabelTxt = "Non"
		var cacheBtn = 'Vider le Cache'
		var defaultBtn = 'Parametres par defaut'
		var noneTxt = "Pas";
		revertTitleTxt = "Retablir les parametres par defaut?"
		revertBodyTxt = "Cette action ne peut pas etre annulee. Toutes vos donnees seront effacees."
		resetBtnTxt = "remise a zero"
		cancelBtnTxt = "Annuler"
		cacheBtnBody = "Votre cache a ete effacee."
		this.controller.get('notifyTitleText').update('Parametres de Notification');
		this.controller.get('notificationLabel').update('Notifications');
		var intervalLabel = "Intervalle"
		var manualUpdates = "Mises a jour manuelles"
		var minutesLabel = "Minutes"
		var hourlyLabel = "Horaire"
		var hoursLabel = "Heures"
		var dayLabel = "Jour"
		notificationTitle = "Notifications"
		notificationMsg = "Les notifications sont active. Cette option peut reduire la vie de la batterie."
		restartTitle = "Changement de langues"
		restartMsg = "Voulez-vous redemarrer Sea Bird maintenant?"
		yesBtn = "Oui"
		noBtn = "Non"
	}
		this.tattr2 = {
  			trueLabel:  trueLabelTxt,
  			trueValue:  '' ,
 			falseLabel:  falseLabelTxt,
  			falseValue: '',
  			fieldName:  'toggle'
  		}
		this.tModel2 = {
			value:  rotationValue,   
 			disabled: false 
			
		}
		this.tattr3 = {
  			trueLabel:  trueLabelTxt,
  			trueValue:  '' ,
 			falseLabel:  falseLabelTxt,
  			falseValue: '',
  			fieldName:  '' 
  		}
		this.tModel3 = {
			value:  notify, 
 			disabled: false 
			
		}
		this.tattr4 = {
  			trueLabel:  trueLabelTxt,
  			trueValue:  '' ,
 			falseLabel:  falseLabelTxt,
  			falseValue: '',
  			fieldName:  '' 
  		}
		this.tModel4 = {
			value:  shakeEnabled, 
 			disabled: false 
			
		}
		this.tattr5 = {
  			trueLabel:  trueLabelTxt,
  			trueValue:  '' ,
 			falseLabel:  falseLabelTxt,
  			falseValue: '',
  			fieldName:  '' 
  		}
		this.tModel5 = {
			value:  coverFlowEnabled, 
 			disabled: false 
			
		}	
		this.tattr6 = {
  			trueLabel:  trueLabelTxt,
  			trueValue:  '' ,
 			falseLabel:  falseLabelTxt,
  			falseValue: '',
  			fieldName:  '' 
  		}
		this.tModel6 = {
			value:  vibrationEnabled, 
 			disabled: false 
			
		}	
	this.controller.setupWidget('button-1', 
				this.atts = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model = {
					buttonLabel: defaultBtn,
					buttonClass: 'negative',
					disabled: false
				});
	this.controller.setupWidget('button-2', 
				this.atts2 = {
					type: Mojo.Widget.defaultButton
					}, 
				this.model2 = {
					buttonLabel: cacheBtn,
					buttonClass: 'Default',
					disabled: false
				});						
	this.firstAttributes = {
		label: $L(languageTxt), 
		choices: [
				{label: $L('Deutsch'), value: 'de'},
				{label: $L('English'), value: 'en'},
				{label: $L('Francais'), value: 'fr'},
		], 

		modelProperty:'firstValue' 
	},
	this.firstModel = {
		'firstValue': language 
	}
	this.controller.setupWidget('firstSelector', this.firstAttributes, this.firstModel);
	this.controller.setupWidget("intervalList",
        {
            label: $L(intervalLabel),
            choices: [
                {label: $L(manualUpdates),     value: "00:00:00"},
                {label: $L("5 " + minutesLabel),         value: "00:05:00"},    
                {label: $L("15 " + minutesLabel),       value: "00:15:00"},  
				{label: $L("30 " + minutesLabel),       value: "00:30:00"},  
                {label: $L(hourlyLabel),             value: "01:00:00"}, 
				{label: $L("2 " + hoursLabel),             value: "02:00:00"},   
                {label: $L("4 " + hoursLabel),             value: "04:00:00"},
                {label: $L("1 " + dayLabel),             value: "23:59:59"}
            ]    
        },
        this.IntervalModel = {
            value : interval,
			disabled: notificationDisabled
        });
	this.controller.setupWidget('att-toggle2', this.tattr2,this.tModel2);
	this.controller.setupWidget('att-toggle3', this.tattr3,this.tModel3);
	this.controller.setupWidget('att-toggle4', this.tattr4,this.tModel4);
	this.controller.setupWidget('att-toggle5', this.tattr5,this.tModel5);
	this.controller.setupWidget('att-toggle6', this.tattr5,this.tModel6);
	this.handleClicked = this.handleClicked.bind(this);
	this.handleClicked2 = this.handleClicked2.bind(this);
	this.togglePressed2 = this.togglePressed2.bindAsEventListener(this);
	this.togglePressed3 = this.togglePressed3.bindAsEventListener(this);
	this.togglePressed4 = this.togglePressed4.bindAsEventListener(this);
	this.togglePressed5 = this.togglePressed5.bindAsEventListener(this);
	this.togglePressed6 = this.togglePressed6.bindAsEventListener(this);
	this.changeLanguageHandler = this.changeLanguageHandler.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get("firstSelector"), Mojo.Event.propertyChange, this.changeLanguageHandler);
	Mojo.Event.listen(this.controller.get('button-1'),Mojo.Event.tap, this.handleClicked);
	Mojo.Event.listen(this.controller.get('button-2'),Mojo.Event.tap, this.handleClicked2);
	Mojo.Event.listen(this.controller.get('att-toggle2'),Mojo.Event.propertyChange,this.togglePressed2);
	Mojo.Event.listen(this.controller.get('att-toggle3'),Mojo.Event.propertyChange,this.togglePressed3);
	Mojo.Event.listen(this.controller.get('att-toggle4'),Mojo.Event.propertyChange,this.togglePressed4);
	Mojo.Event.listen(this.controller.get('att-toggle5'),Mojo.Event.propertyChange,this.togglePressed5);
	Mojo.Event.listen(this.controller.get('att-toggle6'),Mojo.Event.propertyChange,this.togglePressed6);
	Mojo.Event.listen(this.controller.get('infoBox'), Mojo.Event.tap,this.showHelp.bind(this));
	if (rotationValue == true)
	{
		this.controller.stageController.setWindowOrientation('free');
	}
	else
	{
		this.controller.stageController.setWindowOrientation('up');
	}
};
PreferencesAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'back':
				this.controller.stageController.popScene();
			break;
		}
	}
};
PreferencesAssistant.prototype.showHelp = function(event){
	this.controller.stageController.pushScene('help',language);
};
PreferencesAssistant.prototype.changeLanguageHandler = function(event){
	this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{	
		this.controller.window.close();									
	}},
		title:restartTitle,
		message:restartMsg,
		choices:[{label: yesBtn, value:'yes', type:'affirmative'}, {label:noBtn, value:'no', type:'negative'}]
	});	
};
PreferencesAssistant.prototype.handleClicked = function(event){
	this.showConfirmBox(revertTitleTxt,revertBodyTxt);
};
PreferencesAssistant.prototype.activate = function(event) {
};

PreferencesAssistant.prototype.deactivate = function(event) {
	if (resetMode == false)
	{
		this.cookie = new Mojo.Model.Cookie('prefs')
	  	this.cookie.put({
		rotation: rotationValue,
		language: this.firstModel['firstValue'],
		interval: this.IntervalModel.value,
		shake: shakeEnabled,
		coverFlow: coverFlowEnabled,
		vibration: vibrationEnabled
	})
	}
};
PreferencesAssistant.prototype.cleanup = function(event) {
Mojo.Event.stopListening(this.controller.get('att-toggle2'),Mojo.Event.propertyChange,this.togglePressed2);
Mojo.Event.stopListening(this.controller.get('att-toggle3'),Mojo.Event.propertyChange,this.togglePressed3);
Mojo.Event.stopListening(this.controller.get('att-toggle4'),Mojo.Event.propertyChange,this.togglePressed4);
Mojo.Event.stopListening(this.controller.get('button-1'),Mojo.Event.tap, this.handleClicked);
Mojo.Event.stopListening(this.controller.get('button-2'),Mojo.Event.tap, this.handleClicked2);
};
PreferencesAssistant.prototype.togglePressed4 = function(event){
		shakeEnabled = event.value;
}
PreferencesAssistant.prototype.togglePressed6 = function(event){
		vibrationEnabled = event.value;
		if(event.value == true)
			this.controller.stageController.getAppController().playSoundNotification( "vibrate", "" );
}
PreferencesAssistant.prototype.togglePressed5 = function(event){
		coverFlowEnabled = event.value;
}
PreferencesAssistant.prototype.togglePressed2 = function(event){
		rotationValue = event.value;
		if (rotationValue == true)
	{
		this.controller.stageController.setWindowOrientation('free');
	}
	else
	{
		this.controller.stageController.setWindowOrientation('up');
	}
	this.tModel2.value = rotationValue;
	this.controller.modelChanged(this.togglePressed2);
	
}
PreferencesAssistant.prototype.togglePressed3 = function(event){
	notify = event.value;
	if(notify == false)
	{
		interval = "00:00:00";
		this.IntervalModel.value = "00:00:00";
		this.IntervalModel.disabled = true;
		this.controller.modelChanged(this.IntervalModel);
	}
	else
	{
		this.controller.showAlertDialog({
		onChoose: function(value) {{}},
		title:notificationTitle,
		message:notificationMsg,
		choices:[{label: 'OK', value:'yes', type:'default'}]
	});	
		this.IntervalModel.disabled = false;
		this.controller.modelChanged(this.IntervalModel);
	}
}
PreferencesAssistant.prototype.handleClicked2 = function(event){
		this.cookie = new Mojo.Model.Cookie('prefs')
	  	this.cookie.put({
			rotation: false,
			language: "en",
			interval: "00:15:00",
			shake: false,
			coverFlow: false,
			vibration: false
		})
		this.showDialogBox("",cacheBtnBody)		
};
PreferencesAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
};
PreferencesAssistant.prototype.showConfirmBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {if(value == 'yes')
	{	
		resetMode = true;
		this.cookie = new Mojo.Model.Cookie('prefs')
	  	this.cookie.put({
		rotation: false,
		language: "en",
		interval: "00:15:00",
		shake: false,
		coverFlow: false,
		vibration: false})
		this.data = [];
		this.data[0] = {
			'name': 'Fioware News',
			'number': 'http://fioware.com/feed/',
			'unreadCount': 0,
			'stories':[],
			'icon': 'feedlist-default',
			'newestFeed': ""
		}
		this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
		this.feedDb.add("feeds", this.data);
		this.controller.stageController.popScene("prefs");	
		this.controller.stageController.getAppController().playSoundNotification( "vibrate", "" );												
	}},
		title:title,
		message:message,
		choices:[{label: resetBtnTxt, value:'yes', type:'negative'}, {label:cancelBtnTxt, value:'no', type:'default'}]
	});	
};