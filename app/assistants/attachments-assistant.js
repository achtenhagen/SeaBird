this.images = [];
this.url = "";
this.fileTarget = "";
this.curPhotoIndex;
var emailQueue = false;
var smsQueue = false;
function AttachmentsAssistant(images) {
	this.images = images;
}
AttachmentsAssistant.prototype.reset = function(){
		this.progress = 0;      
}
AttachmentsAssistant.prototype.cleanup = function(){
		window.clearInterval(this.updater);   
		Mojo.Event.stopListening(this.controller.get('progressBar'),Mojo.Event.cancel, this.cancelled);
	    Mojo.Event.stopListening(this.controller.get('progressBar'),Mojo.Event.progressComplete, this.complete);		
}

AttachmentsAssistant.prototype.cancelled = function(){
		window.clearInterval(this.updater);
		alert("cancelled");
		this.attr.title = "cancelled";
		this.controller.modelChanged(this.model);       
}

AttachmentsAssistant.prototype.complete = function(){}
AttachmentsAssistant.prototype.setup = function() {
	this.controller.enableFullScreenMode(true);
	this.curPhotoIndex = 0;
	this.positionDelta = {
		left: -1,
		center: 0,
		right: 1
	}
	var attributes = {
			noExtractFS : true,
			highResolutionLoadTimeout: 3,
			limitZoom: true};
	this.model = {
		onLeftFunction : this.wentLeft.bind(this),
		onRightFunction : this.wentRight.bind(this)
	}
	this.controller.setupWidget('myPhotoDiv', attributes, this.model);
	this.attributes = {
           menuClass: 'no-fade'
        },
this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, {items: [ {label: $L('Images'), items:[{},
	{label: $L(''), command:'save', icon:'save'}, {label: $L(''), command:'pics', iconPath: "images/pics.png"}, {label: $L(''), command:'send', icon: 'send'},{}
								]}
							]});	
	this.attr = {};
		this.model = {
			value: 0,
			disabled : false
		};
	this.controller.setupWidget('progressBar', this.attr, this.model);
	this.cancelled = this.cancelled.bind(this);
	this.complete = this.complete.bind(this);
	this.progress = 0;		
	this.reset = this.reset.bind(this);		
	this.controller.get('imageTitle').update(this.images[0])
	this.url = this.images[0]
	this.myPhotoDivElement = this.controller.get('myPhotoDiv');
	this.imageViewChanged = this.imageViewChanged.bind(this);
	Mojo.Event.listen(this.controller.get('myPhotoDiv'),Mojo.Event.imageViewChanged,this.imageViewChanged);
	Mojo.Event.listen(this.controller.get('progressBar'),Mojo.Event.cancel, this.cancelled);
	Mojo.Event.listen(this.controller.get('progressBar'),Mojo.Event.progressComplete, this.complete);
};
AttachmentsAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
};
AttachmentsAssistant.prototype.downloadAttachment = function(event){
	this.progress = 0;
			try{
		 		this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
		 		method: 'download',
				parameters: {
					target: this.url,
					targetDir : "/media/internal/downloads",
					"targetFilename" : "",
					keepFilenameOnRedirect: true,
					subscribe: true
				},
				onSuccess : function (resp){
						this.progress = ((resp.amountReceived / resp.amountTotal)*10);
						this.model.value = this.progress;
						this.controller.modelChanged(this.model)	
						if(resp.completed  == true)
						{
							this.fileTarget = resp.target;
							if(emailQueue == true)
								this.sendEmail();
							if(smsQueue == true)
								this.sendSms();
						}			
					}.bind(this),			
				onFailure : function (e){this.showDialogBox("",e.errorText)}.bind(this)
			});
	}catch(e){}
};
AttachmentsAssistant.prototype.sendSms = function(event){
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
                       method: "open",
                       parameters: {
                           id: "com.palm.app.messaging",
                           params: {
                               messageText: $L("Check out this Photo!"),
							   attachment: this.fileTarget
                           }
                       }
                });
}
AttachmentsAssistant.prototype.sendEmail = function(event){
	if(this.fileTarget != "" && this.fileTarget != null && this.model.value == 10)
				{
					this.attachments = [];
					this.attachments[0] = {fullPath: this.fileTarget}
					 this.controller.serviceRequest("palm://com.palm.applicationManager", {
                       method: "open",
                       parameters:  {
                           id: "com.palm.app.email",
                           params: {
                            summary: $L("Sea Bird 2 - Check out this Photo!"),
                            text: '',
							attachments: this.attachments
                        }
                    }
                });			
				}		
};
AttachmentsAssistant.prototype.shareHandler = function(command) {		    
        switch(command) {
            case "do-emailStory": 
				emailQueue = false; 
				if(this.fileTarget == "" || this.fileTarget == null || this.model.value != 10)
				{
					emailQueue = true;
					this.downloadAttachment(); 
				}
				else
					this.sendEmail();							
                break;
            case "do-messageStory":   
			smsQueue = false; 
				if(this.fileTarget == "" || this.fileTarget == null || this.model.value != 10)
				{
					smsQueue = true;
					this.downloadAttachment(); 
				}
				else 
                	this.sendSms();
                break;
       		}    
};
AttachmentsAssistant.prototype.handleCommand = function(event){
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'save':
				this.downloadAttachment();
				break;
				case 'send':
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
			case 'pics':
			this.controller.serviceRequest('palm://com.palm.applicationManager', {
    		method: 'open',
    		parameters: {
        	id: 'com.palm.app.photos',
        	params: {}
    }
})
			break;
		}
	}
};
AttachmentsAssistant.prototype.showDialogBox = function(title,message){
		this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
};
AttachmentsAssistant.prototype.imageViewChanged = function(event){
result = this.myPhotoDivElement.mojo.getCurrentParams();
this.myPhotoDivElement.mojo.getCurrentParams().scale;	
this.controller.get('imageTitle').update(result.sourceImage);
this.url = result.sourceImage;
this.progress = 0;
this.model.value = this.progress;
this.controller.modelChanged(this.model)	
}
AttachmentsAssistant.prototype.movePhotoIndex = function(direction){
		this.curPhotoIndex = this.curPhotoIndex + this.positionDelta[direction];
		if(this.curPhotoIndex > this.images.length-1 || this.curPhotoIndex < 1) {	
			this.curPhotoIndex = this.wrapAroundMarioStyle( this.curPhotoIndex, this.images.length );
		}		
};
AttachmentsAssistant.prototype.wentLeft = function(event){
	this.movePhotoIndex('left');
	this.myPhotoDivElement.mojo.leftUrlProvided(this.getUrlForThe('left'));
}
AttachmentsAssistant.prototype.wrapAroundMarioStyle = function(index, max){
		return Math.abs(Math.abs(index) - max);
}
AttachmentsAssistant.prototype.getUrlForThe = function(position){
		var urlIndex;
		urlIndex = this.curPhotoIndex + this.positionDelta[position];
		if(urlIndex > this.images.length-1 || urlIndex < 0) {	
			urlIndex = this.wrapAroundMarioStyle(urlIndex, this.images.length); 
		}	
		return this.images[urlIndex];
};
AttachmentsAssistant.prototype.wentRight = function(event){
this.movePhotoIndex('right');
this.myPhotoDivElement.mojo.rightUrlProvided(this.getUrlForThe('right'));
}
AttachmentsAssistant.prototype.activate = function(event) {
	this.myPhotoDivElement.mojo.centerUrlProvided(this.getUrlForThe('center'));
	this.myPhotoDivElement.mojo.leftUrlProvided(this.getUrlForThe('left'));
	this.myPhotoDivElement.mojo.rightUrlProvided(this.getUrlForThe('right'));
};

AttachmentsAssistant.prototype.deactivate = function(event) {
	
};

AttachmentsAssistant.prototype.cleanup = function(event) {
Mojo.Event.stopListening(this.controller.get('myPhotoDiv'),Mojo.Event.imageViewChanged,this.imageViewChanged);
};
