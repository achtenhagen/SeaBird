this.data;
this.url = "";
this.curPhotoIndex;
this.positionDelta = [];
function FlowAssistant(args) {
	this.data = [];
	this.data = args;
}
FlowAssistant.prototype.setup = function() {
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
	this.myPhotoDivElement = this.controller.get('myPhotoDiv');
	this.imageViewChanged = this.imageViewChanged.bind(this);
	this.controller.get('feedTitle').update(this.data[this.curPhotoIndex].name)
	this.controller.get('feedUrl').update(this.data[this.curPhotoIndex].number)
	this.url = 'images/card.png';
	this.openFeed = this.openFeed.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('myPhotoDiv'),Mojo.Event.imageViewChanged,this.imageViewChanged);
	Mojo.Event.listen(this.controller.get('myPhotoDiv'),Mojo.Event.tap,this.openFeed);
};
FlowAssistant.prototype.openFeed = function(event){
	try {
		Mojo.Controller.stageController.popScene('flow');
		this.controller.stageController.pushScene('storyList',this.data[this.curPhotoIndex].name,this.data[this.curPhotoIndex].number,this.data);
		
} catch (e) {
	this.showDialogBox("",e.message);
}
};
FlowAssistant.prototype.imageViewChanged = function(event){
//result = this.myPhotoDivElement.mojo.getCurrentParams();
this.myPhotoDivElement.mojo.getCurrentParams().scale;		
}
FlowAssistant.prototype.orientationChanged = function(event){
	if(event == 'up' || event == 'down')
	{
		Mojo.Controller.stageController.popScene('flow');
	}
};
FlowAssistant.prototype.movePhotoIndex = function(direction){
		this.curPhotoIndex = this.curPhotoIndex + this.positionDelta[direction];
		if(this.curPhotoIndex > this.data.length-1 || this.curPhotoIndex < 1) {	
			this.curPhotoIndex = this.wrapAroundMarioStyle(this.curPhotoIndex, this.data.length);
		}
		try {
		this.controller.get('feedTitle').update(this.data[this.curPhotoIndex].name)	
		this.controller.get('feedUrl').update(this.data[this.curPhotoIndex].number)
		} catch (e) {
			this.controller.get('feedTitle').update(this.data[0].name)	
			this.controller.get('feedUrl').update(this.data[0].number)
		}	
	
};
FlowAssistant.prototype.wentLeft = function(event){
	this.movePhotoIndex('left');
	this.myPhotoDivElement.mojo.leftUrlProvided(this.getUrlForThe('left'));
		
}
FlowAssistant.prototype.wrapAroundMarioStyle = function(index, max){
		return Math.abs(Math.abs(index) - max);
}
FlowAssistant.prototype.getUrlForThe = function(position){
		var urlIndex;
		urlIndex = this.curPhotoIndex + this.positionDelta[position];
		if(urlIndex > this.data.length-1 || urlIndex < 0) {	
			urlIndex = this.wrapAroundMarioStyle(urlIndex, this.data.length); 
		}	
		return 'images/card.png';
};
FlowAssistant.prototype.wentRight = function(event){
this.movePhotoIndex('right');
this.myPhotoDivElement.mojo.rightUrlProvided(this.getUrlForThe('right'));
}
FlowAssistant.prototype.activate = function(event) {
	this.myPhotoDivElement.mojo.centerUrlProvided(this.getUrlForThe('center'));
	this.myPhotoDivElement.mojo.leftUrlProvided(this.getUrlForThe('left'));
	this.myPhotoDivElement.mojo.rightUrlProvided(this.getUrlForThe('right'));
	this.myPhotoDivElement.mojo.manualSize(Mojo.Environment.DeviceInfo.screenHeight,'255');
};

FlowAssistant.prototype.deactivate = function(event) {
};

FlowAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('myPhotoDiv'),Mojo.Event.imageViewChanged,this.imageViewChanged);
	Mojo.Event.stopListening(this.controller.get('myPhotoDiv'),Mojo.Event.tap,this.openFeed);
};
