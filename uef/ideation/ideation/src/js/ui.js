var UI = function() {

	this.canvases = [];
	this.currentIndex = -1;

};

UI.prototype.addCanvas = function(container) {

	var canvas = new TeledrawCanvas(container, {

		width: window.innerWidth,
		height: window.innerHeight

	});

	this.canvases.push(canvas);

	this.currentIndex++;

};

UI.prototype.getNumberOfCanvases = function() {

	return this.canvases.length;

};

UI.prototype.increaseIndex = function() {

	if (this.currentIndex < this.canvases.length - 2)
		this.currentIndex++;

};

UI.prototype.decreaseIndex = function() {

	if (this.currentIndex > 0)
		this.currentIndex--;

};

UI.prototype.getCanvas = function() {

	return this.canvases[this.currentIndex];

};

UI.prototype.getCanvasByIndex = function(index) {

	this.currentIndex = index;

	return this.getCanvas();

};

UI.prototype.deleteCanvas = function() {

	if (this.canvases.length) {
	
		this.currentIndex = this.canvases.length - 2;

		return this.canvases.pop();

	}

};
