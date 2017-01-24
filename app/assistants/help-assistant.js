var language = "en";
function HelpAssistant(l) {
	language = l;
}

HelpAssistant.prototype.setup =  function() {     
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024){
		this.controller.enableFullScreenMode(false);
		this.attributes = {spacerHeight: 0, menuClass: 'no-fade'};
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items:[{icon: 'back', command: 'back'},{},{}]});
	}
	else
		this.controller.enableFullScreenMode(true); 
   if(language == "en" || language == "" || language == null)   
   {
   		this.helpTopics = [];
   		this.helpTopics = [
        {
            title: $L("What is Sea Bird 3?"),
            text:$L("<b>Sea Bird 3</b> is an easy to use news client that will fetch and deliver news feeds for you. With a user friendly interface that is easy on the eye, this lightweight application will make it more enjoyable to read news on your mobile device. We support <b>RSS</b>, <b>Atom</b> and <b>RDF</b>. If you would like to be kept up to date with <b>Sea Bird 3</b>, subscribe to our news feed to learn about the latest features in upcoming updates."),
            open: false
        },{
            title: $L("How Do I suggest a feature?"),
            text:$L("To suggest a feature, please leave a comment on the <b>Sea Bird 3</b> app in the <b>App Catalog</b>."),
            open: false
        },{
            title: $L("How Do I report a bug?"),
            text:$L("You can report a bug by either sending an email to <b>maurice@fioware.com</b> or leaving a comment on the <b>Sea Bird 3</b> app in the <b>App Catalog</b>."),
            open: false
        },{
            title: $L("How Do I Search for more feeds?"),
            text: $L("You can search for more news sources with Feed Discovery."),
            open: false
        },{
            title: $L("Update Previews"),
            text: $L("If you are interested in reading about new features that will be available in future updates, make sure you have our news feed enabled."),
            open: false
        },{
            title: $L("Languages"),
            text: $L("This application supports the <b>German</b> and <b>French</b> language pack."),
            open: false
        },{
            title: $L("Message from Developer"),
            text: $L("We would like to thank you very much for downloading this app! Expect updates and new apps to come very soon. <b>Enjoy using Sea Bird 3</b>!<br><br>-<b>The Fioware Team</b><br><font style='font-size:16px;'>This application is dedicated to my loving father Martin. May you rest in peace forever.</font><br>"),
            open: false
        }
    ];
   }
   else if(language == "de")
   {
   		this.helpTopics = [];
   		this.helpTopics = [
        {
            title: $L("Was ist Sea Bird 3?"),
            text:$L("<b>Sea Bird 3</b> ist ein einfaches RSS Nachrichten Programm. Eine freundliche Benutzeroberfl&auml;che hilft ihnen Nachrichten einfach und schneller zu lesen."),
            open: false
        },{
            title: $L("Wie kann eine neue Funktion empfehlen?"),
            text:$L("Um eine Funktion zu empfehlen, bitte hinterlassen Sie ein Kommentar im <b>App Catalog</b>."),
            open: false
        },{
            title: $L("Fehlermeldung?"),
            text:$L("Im Fall Sie einen Fehler im Programm finden sollten, so schreiben Sie mir doch bitte eine E-mail unter: <b>maurice@fioware.com</b> oder hinterlassen Sie ein Kommentar im <b>App Catalog</b>."),
            open: false
        },{
            title: $L("Wie suche Ich nach weiteren Abos?"),
            text: $L("Mit Hilfe von Feed Discovery k&ouml;nnen sie weitere feeds abonnieren."),
            open: false
        },{
            title: $L("Update Previews"),
            text: $L("Wenn Sie an neue updates interessiert sind, dann sollten Sie unseren News Feed abonnieren."),
            open: false
        },{
            title: $L("Sprachen"),
            text: $L("Diese Anwendung unterst&uuml;tzt <b>Deutsch</b> und <b>Franz&ouml;sisch</b>."),
            open: false
        },{
            title: $L("Nachricht vom Developer"),
            text: $L("Wir m&ouml;chte Ihnen ganz herzlich danken f&uuml;r die Unterst&uuml;tzung durch den download dieses app! Neue updates sind bald zu erwarten. <b>Viel Spass mit Sea Bird 3</b>!<br><br>-<b>Maurice Achtenhagen :-)</b><br><br>"),
            open: false
        }
    ];
   }
   else if(language == "fr")
   {
   		this.helpTopics = [];
   		this.helpTopics = [
        {
            title: $L("Sea Bird 3"),
            text:$L("<b>Sea Bird 3</b> est un programme simple nouvelles RSS. Une interface conviviale vous permet de lire des messages rapidement et facilement."),
            open: false
        },{
            title: $L("Comment peut suggerer une nouvelle fonctionnalit&eacute; ?"),
            text:$L("Pour demander une fonctionnalit&eacute; , s'il vous pla&icirc;t laissez un commentaire dans <b>catalogue d'applications</b>."),
            open: false
        },{
            title: $L("Comment puis-je signaler un bug?"),
            text:$L("Dans le cas o&ugrave; vous devriez trouver un bug dans le programme, donc s'il vous pla&icirc;t &eacute;crivez-moi un e-mail &agrave; l'adresse: <b>maurice@fioware.com</b> ou laisser un commentaire en <b>catalogue d'applications</b>."),
            open: false
        },{
            title: $L("Comment puis-je chercher un autre abonnement?"),
            text: $L("Avec l'aide de RSS Discovery, vous pouvez vous abonner &agrave; plusieurs RSS feeds."),
            open: false
        },{
            title: $L("Mise a jour Previews"),
            text: $L("Si vous &ecirc;tes int&eacute;ress&eacute;  &agrave; nouvelle mise &agrave; jour, vous devez vous abonner &agrave; notre fil de nouvelles."),
            open: false
        },{
            title: $L("Langues"),
            text: $L("Cette application prend en charge <b> Allemand </ b> et <b> fran&ccedil;ais</b>."),
            open: false
        },{
            title: $L("Message du developpeur"),
            text: $L("Nous voulons vous remercier sinc&egrave;rement pour leur soutien par le téléchargement de ce logiciel! Nouvelles mises &agrave; jour sont attendus prochainement. <b>Amusez-vous avec Sea Bird 3!</b><br><br>-<b>Maurice Achtenhagen :-)</b><br><br>"),
            open: false
        }
    ];
   }      
   
	
    this.controller.setupWidget("helpListWgt", 
        {
            itemTemplate: "help/help-row-template",
            listTemplate: "help/help-list-template",
            swipeToDelete: false, 
            renderLimit: 40,
            reorderable: false
        },    
        this.helpModel = {
            items: this.helpTopics
        }
    );
    
    this.openHelpTopicHandler = this.openHelpTopic.bindAsEventListener(this);
    this.controller.listen("helpListWgt", Mojo.Event.listTap,this.openHelpTopicHandler);
    this.controller.setupWidget("helpDrawer", {modelProperty: "open"});
};
HelpAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'back':
				this.controller.stageController.popScene();
			break;
		}
	}
};
HelpAssistant.prototype.activate =  function() {
    this.controller.modelChanged(this.helpModel);                    
};

HelpAssistant.prototype.cleanup =  function() {};

HelpAssistant.prototype.openHelpTopic = function(event) {
   if (this.helpModel.items[event.index].open === true)   {
        this.helpModel.items[event.index].open = false;
    } else {
        this.helpModel.items[event.index].open = true;
    }
    
    this.controller.modelChanged(this.helpModel.items[event.index], this);
};