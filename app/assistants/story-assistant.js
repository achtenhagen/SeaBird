this.data;
this.url;
this.feedIndex = 0;
v = new Boolean(true);
s = new Boolean(true);	
var img = "";
function StoryAssistant(articleTitle,articaleBody,feedUrl,feedIndex,articles,title,args) {
	this.subscription = title;
	this.title = articleTitle;
	this.text = articaleBody;
	this.url = feedUrl;
	this.feedIndex = feedIndex;
	this.index = feedIndex;
	this.stories = articles;
	this.data = [];
	this.data = args;
}
StoryAssistant.prototype.setup = function() {
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024)
		this.controller.enableFullScreenMode(false);
	else
		this.controller.enableFullScreenMode(true);
	this.attributes = {
           spacerHeight: 0,
           menuClass: 'no-fade'
        }
	if(Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch")>-1 || Mojo.Environment.DeviceInfo.screenWidth==1024 || Mojo.Environment.DeviceInfo.screenHeight==1024) {
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items: [
		{icon: 'back', command: "return"},
		{},
		{items: [{label: $L('Back'), icon:'back', command:'back'},{iconPath: "images/web.png", command:'www'},{icon:'forward', command:'fwd'}]},
		{},
		{icon: "send", command: "send"}]});		
	}
	else
	{
		this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items: [
        {iconPath: "images/web.png", command: "www"},
        {},
        {items: [{icon:'back', command:'back'},{label: $L('Forward'), icon:'forward', command:'fwd'}]},
        {},
        {icon: "send", command: "send"}]});	
	}
	this.controller.get('storyTitle-txt').update(this.title);
	this.text = this.text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
	this.controller.get('storyText').update(this.text);
	this.stories[this.index].unread = 'feedlist-read';
	this.stories[this.index].unreadStyle = 'read';
	this.stories[this.index].previewStyle = 'storyPreviewRead truncating-text';
	this.flickHandler = this.onFlick.bindAsEventListener(this);
	this.hideMenu = this.hideMenu.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('storyTitle'), Mojo.Event.tap, this.hideMenu);
    Mojo.Event.listen(this.controller.window, Mojo.Event.flick, this.flickHandler, false);
};
StoryAssistant.prototype.hideMenu = function(event){
	if(v == true)
			{
				this.controller.setMenuVisible(Mojo.Menu.commandMenu, false);
			v = false;
			}
			else if (v == false)
			{
				this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
				v = true;
			}	
};
StoryAssistant.prototype.onFlick = function(event) {
	 if (event.velocity.x >= 2000)   {
     if(this.index > 0)
				{
					this.stories[this.index-1].text = this.stories[this.index-1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.index-1].title);
					this.controller.get('storyText').update(this.stories[this.index-1].text);	
					if(this.stories[this.index-1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.index-1].unread = 'feedlist-read';
					this.stories[this.index-1].unreadStyle = 'read';
					this.stories[this.index-1].previewStyle = 'storyPreviewRead truncating-text';
					this.index -= 1;
				}
				else if (this.index == 0)
				{
					this.stories[this.stories.length-1].text = this.stories[this.stories.length-1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.stories.length-1].title);
					this.controller.get('storyText').update(this.stories[this.stories.length-1].text);
					if(this.stories[this.stories.length-1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.stories.length-1].unread = 'feedlist-read';
					this.stories[this.stories.length-1].unreadStyle = 'read';
					this.stories[this.stories.length-1].previewStyle = 'storyPreviewRead truncating-text';
					this.index = this.stories.length-1;
				}   
  	}
   else if(event.velocity.x <= -2000)   {
   	   if(this.index < this.stories.length-1)
				{
					this.stories[this.index+1].text = this.stories[this.index+1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.index+1].title);
					this.controller.get('storyText').update(this.stories[this.index+1].text);
					if(this.stories[this.index+1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.index+1].unread = 'feedlist-read';
					this.stories[this.index+1].unreadStyle = 'read';
					this.stories[this.index+1].previewStyle = 'storyPreviewRead truncating-text';
					this.index += 1;	
				}
				else if(this.index == this.stories.length-1)
				{
					this.stories[0].text = this.stories[0].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[0].title);
					this.controller.get('storyText').update(this.stories[0].text);
					if(this.stories[0].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[0].unread = 'feedlist-read';
					this.stories[0].unreadStyle = 'read';
					this.stories[0].previewStyle = 'storyPreviewRead truncating-text';
					this.index = 0;
				}
   }
};
StoryAssistant.prototype.activate = function(event) {};

StoryAssistant.prototype.deactivate = function(event) {
	this.feedDb = new Mojo.Depot({name:"ext:feedDb",replace: false});
	this.feedDb.add("feeds",this.data);	
};

StoryAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('storyTitle-txt'), Mojo.Event.tap, this.hideMenu);
	Mojo.Event.stopListening(this.controller.window, Mojo.Event.flick, this.flickHandler, false);
};
StoryAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'www':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
                       method: "open",
                       parameters: {
                           id: "com.palm.app.browser",
                           params: {
                               target: this.stories[this.index].url
                           }
                       }
                });
				break;
				case 'back':
				if(this.index > 0)
				{
					this.stories[this.index-1].text = this.stories[this.index-1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.index-1].title);
					this.controller.get('storyText').update(this.stories[this.index-1].text);	
					if(this.stories[this.index-1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.index-1].unread = 'feedlist-read';
					this.stories[this.index-1].unreadStyle = 'read';
					this.stories[this.index-1].previewStyle = 'storyPreviewRead truncating-text';
					this.index -= 1;
				}
				else if (this.index == 0)
				{
					this.stories[this.stories.length-1].text = this.stories[this.stories.length-1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.stories.length-1].title);
					this.controller.get('storyText').update(this.stories[this.stories.length-1].text);
					if(this.stories[this.stories.length-1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.stories.length-1].unread = 'feedlist-read';
					this.stories[this.stories.length-1].unreadStyle = 'read';
					this.stories[this.stories.length-1].previewStyle = 'storyPreviewRead truncating-text';
					this.index = this.stories.length-1;
				}
				break;
				case 'fwd':
				if(this.index < this.stories.length-1)
				{
					this.stories[this.index+1].text = this.stories[this.index+1].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[this.index+1].title);
					this.controller.get('storyText').update(this.stories[this.index+1].text);
					if(this.stories[this.index+1].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[this.index+1].unread = 'feedlist-read';
					this.stories[this.index+1].unreadStyle = 'read';
					this.stories[this.index+1].previewStyle = 'storyPreviewRead truncating-text';
					this.index += 1;	
				}
				else if(this.index == this.stories.length-1)
				{
					this.stories[0].text = this.stories[0].text.replace(/<[\/]{0,1}(iframe|IFRAME)[^><]*>/g,"");
					this.controller.get('storyTitle-txt').update(this.stories[0].title);
					this.controller.get('storyText').update(this.stories[0].text);
					if(this.stories[0].unreadStyle == 'unread')
						this.data[this.feedIndex].unreadCount --;
					this.stories[0].unread = 'feedlist-read';
					this.stories[0].unreadStyle = 'read';
					this.stories[0].previewStyle = 'storyPreviewRead truncating-text';
					this.index = 0;
				}
				break;
				case "send":
                var myEvent = event;
                var findPlace = myEvent.originalEvent.target;
                this.controller.popupSubmenu({
                    onChoose:  this.shareHandler,
                    placeNear: findPlace,
                    items: [
                        {label: $L("Email"), command: "do-emailStory"},
                        {label: $L("SMS/IM"), command: "do-messageStory"}
                        ]
                    });
                break;
				case "return":
					this.controller.stageController.popScene();
				break;
		}
	}
}
StoryAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}
StoryAssistant.prototype.shareHandler = function(command) {    
        switch(command) {
            case "do-emailStory":    
                this.controller.serviceRequest("palm://com.palm.applicationManager", {
                       method: "open",
                       parameters:  {
                           id: "com.palm.app.email",
                           params: {
                            summary: $L("Sea Bird 3 News - Check out this article!"),
                            text: this.stories[this.index].url
                        }
                    }
                });
                break;
            case "do-messageStory":    
                this.controller.serviceRequest("palm://com.palm.applicationManager", {
                       method: "open",
                       parameters: {
                           id: "com.palm.app.messaging",
                           params: {
                               messageText: $L("Check this out: ")+this.stories[this.index].url
                           }
                       }
                });
                break;
       }    
};
