DashboardAssistant = Class.create({
	
	initialize: function(c) {
		this.count = c;
	},

	setup: function() {
		this.updateDisplay();
		this.tapHandler = this.tapHandler.bindAsEventListener(this);	
		Mojo.Event.listen(this.controller.get('message_info'),Mojo.Event.tap, this.tapHandler);     
	},
	deactivate: function(){
		 	try {
	this.cookie = new Mojo.Model.Cookie('prefs')
	var cookieSettings = this.cookie.get();
	interval = cookieSettings.interval;
	} catch (e) {
	interval = "00:15:00";
	}
		   if (interval !== "00:00:00") {
		   	this.wakeupRequest = new Mojo.Service.Request("palm://com.palm.power/timeout", {
		   		method: "set",
		   		parameters: {
		   			"key": "update",
		   			"in": "00:00:05",
		   			"wakeup": true,
		   			"uri": "palm://com.palm.applicationManager/open",
		   			"params": {
		   				"id": "com.fioware.seabird",
		   				"params": {
		   					"action": "sync"
		   				}
		   			}
		   		}
		   	});
		   }
	},
	

	
	updateDisplay: function() {
		var props = {
			title: window.name, 
			text: this.messageText, 
			count: this.count
		};
		var messageText = Mojo.View.render({object: props, template: 'dashboard/dashboard-message'});
		var messageDiv = this.controller.get('dashboard-text');
		this.controller.get('unreadCount').update(this.count);
		Element.update(messageDiv, messageText);
		try {
			this.cookie = new Mojo.Model.Cookie('prefs')
			var cookieSettings = this.cookie.get();
			var vibrationEnabled = cookieSettings.vibration
			if(vibrationEnabled == true)
				this.controller.stageController.getAppController().playSoundNotification( "vibrate", "" );
		} catch (e) {}	
	},
	tapHandler: function() {
     this.controller.serviceRequest("palm://com.palm.applicationManager", {
        method: "open",
        parameters: {
            id: "com.fioware.seabird3",
        }
    });
	this.controller.window.close();
	},
	cleanup: function(){
		Mojo.Event.stopListening(this.controller.get('message_info'),Mojo.Event.tap, this.tapHandler);
	},
});

