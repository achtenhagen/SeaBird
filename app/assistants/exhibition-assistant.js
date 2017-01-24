this.data = [];
this.feedsToShow = [];
this.feedIndex = 0;
function ExhibitionAssistant() {}
ExhibitionAssistant.prototype.setup = function() {
	this.controller.stageController.setWindowOrientation('free');
	this.controller.get('contentBody').update('Please wait...')
};
ExhibitionAssistant.prototype.activate = function(event) {
	this.feedDb = new Mojo.Depot({name: "ext:feedDb"});
	this.feedDb.get("feeds", this.dbSuccess.bind(this), this.dbFailure.bind(this));
};

ExhibitionAssistant.prototype.deactivate = function(event) {

};

ExhibitionAssistant.prototype.cleanup = function(event) {

};

ExhibitionAssistant.prototype.showFeed = function(event){
	if(this.feedIndex < this.feedsToShow.length)
	  {
	  	this.feedIndex ++;
	  }
	 else
	  	this.feedIndex = 0;
	 this.controller.get('contentTitle').update(this.feedsToShow[this.feedIndex].title);
	 this.controller.get('contentBody').update(this.feedsToShow[this.feedIndex].text); 
};

ExhibitionAssistant.prototype.dbSuccess = function(settings){
	this.data = [];
	this.data = settings;
	this.feedsToShow = [];
	if (this.data == null)
		this.controller.get('contentBody').update('There are currently no new feeds available. Feed Discovery can help you find content you might like. Get started now!')	
	else{
				for (i = 0; i < this.data.length; i++) 
		{
			for(k = 0; k < this.data[i].stories.length; k++)
			{
				if (this.data[i].stories[k].unreadStyle == 'unread')
				{
					this.feedsToShow[this.feedsToShow.length] =  {
						title: this.data[i].stories[k].title,
						text: this.data[i].stories[k].text					
					}
				}	
			}
		}
	if(this.feedsToShow.length == 0 || this.feedsToShow == null)
		this.controller.get('contentBody').update('There are currently no new feeds available. Feed Discovery can help you find content you might like. Get started now!');
	else
		{
			this.showFeed();
			this.controller.window.setInterval(this.showFeed.bind(this), 10000);	
		}
	}
};

ExhibitionAssistant.prototype.dbFailure = function(transaction, result) {
	this.controller.get('contentBody').update('There are currently no new feeds available. Feed Discovery can help you find content you might like. Get started now!')
};
