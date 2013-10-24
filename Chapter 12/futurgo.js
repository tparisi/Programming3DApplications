/**
 * @fileoverview Futurgo Example - 3D Product Page
 * @author Tony Parisi
 */

Futurgo = function(param) {

	this.container = param.container;
	this.loadCallback = param.loadCallback;
	this.loadProgressCallback = param.loadProgressCallback;
	this.mouseOverCallback = param.mouseOverCallback;
	this.mouseOutCallback = param.mouseOutCallback;
	this.part_materials = [];
	this.vehicleOpen = false;
	this.wheelsMoving = false;
}

Futurgo.prototype.go = function() {
	this.viewer = new Vizi.Viewer({ container : this.container, showGrid : true,
		allowPan: false, oneButton: true });
	this.loadURL(Futurgo.URL);
	this.viewer.run();
}

Futurgo.prototype.loadURL = function(url) {

	var that = this;
	
	var loader = new Vizi.Loader;
	loader.addEventListener("loaded", function(data) { that.onLoadComplete(data, loadStartTime); }); 
	loader.addEventListener("progress", function(progress) { that.onLoadProgress(progress); }); 

	var loadStartTime = Date.now();
	loader.loadScene(url);	
}

Futurgo.prototype.onLoadComplete = function(data, loadStartTime)
{
	var scene = data.scene;
	this.viewer.replaceScene(data);

	// this.useCamera("setup");

	// Add entry fade behavior to the windows
	var that = this;
	scene.map(/windows_front|windows_rear/, function(o) {
		var fader = new Vizi.FadeBehavior({duration:2, opacity:.8});
		o.addComponent(fader);
		setTimeout(function() {
			fader.start();
		}, 2000);

		var picker = new Vizi.Picker;
		picker.addEventListener("mouseover", function(event) { that.onMouseOver("glass", event); });
		picker.addEventListener("mouseout", function(event) { that.onMouseOut("glass", event); });
		picker.addEventListener("touchstart", function(event) { that.onTouchStart("glass", event); });
		picker.addEventListener("touchend", function(event) { that.onTouchEnd("glass", event); });
		o.addComponent(picker);
	});

	// Auto-rotate the scene
	var main = scene.findNode("vizi_mobile");
	var carousel = new Vizi.RotateBehavior({autoStart:true, duration:20});
	main.addComponent(carousel);	
	
	var frame_parts_exp =
		/rear_view_arm_L|rear_view_arm_R|rear_view_frame_L|rear_view_frame_R/;

	scene.map(frame_parts_exp, function(o) {
		o.map(Vizi.Visual, function(v) {
			that.part_materials.push(v.material);
		});
	});

	scene.map(/body2|rear_view_arm_L|rear_view_arm_R/, function(o) {
		var picker = new Vizi.Picker;
		picker.addEventListener("mouseover", function(event) { that.onMouseOver("body", event); });
		picker.addEventListener("mouseout", function(event) { that.onMouseOut("body", event); });
		picker.addEventListener("touchstart", function(event) { that.onTouchStart("body", event); });
		picker.addEventListener("touchend", function(event) { that.onTouchEnd("body", event); });
		o.addComponent(picker);
	});

	scene.map("wheels", function(o) {

		var picker = new Vizi.Picker;
		picker.addEventListener("mouseover", function(event) { that.onMouseOver("wheels", event); });
		picker.addEventListener("mouseout", function(event) { that.onMouseOut("wheels", event); });
		picker.addEventListener("touchstart", function(event) { that.onTouchStart("wheels", event); });
		picker.addEventListener("touchend", function(event) { that.onTouchEnd("wheels", event); });
		o.addComponent(picker);
	});
	
	if (this.loadCallback) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		this.loadCallback(loadTime);
	}
}

Futurgo.prototype.onLoadProgress = function(progress)
{
	// Update the laoder bar
	var percentProgress = progress.loaded / progress.total * 100;
	if (this.loadProgressCallback)
		this.loadProgressCallback(percentProgress);
}

Futurgo.prototype.useCamera = function(name) {
	this.viewer.useCamera(name);
}

Futurgo.prototype.playAnimation = function(name, loop, reverse) {
	var animationNames = this.viewer.keyFrameAnimatorNames;
	var index = animationNames.indexOf(name);
	if (index >= 0)
	{
		this.viewer.playAnimation(index, loop, reverse);
	}
}

Futurgo.prototype.stopAnimation = function(name) {
	var animationNames = this.viewer.keyFrameAnimatorNames;
	var index = animationNames.indexOf(name);
	if (index >= 0)
	{
		this.viewer.stopAnimation(index);
	}
}

Futurgo.prototype.playOpenAnimations = function() {	
	this.playAnimation("animation_window_rear_open");
	this.playAnimation("animation_window_front_open");
}

Futurgo.prototype.playCloseAnimations = function() {	
	this.playAnimation("animation_window_rear_open", false, true);
	this.playAnimation("animation_window_front_open", false, true);
}

Futurgo.prototype.toggleInterior = function() {
	this.vehicleOpen = !this.vehicleOpen;
	var that = this;
	if (this.vehicleOpen) {
		this.playOpenAnimations();
		return;
		setTimeout(function() {
			that.useCamera("interior");
		}, 2000);
	}
	else {
		this.playCloseAnimations();
		return;
		setTimeout(function() {
			that.useCamera("setup");
		}, 2000);
	}
}

Futurgo.prototype.playWheelAnimations = function() {
	this.playAnimation("animation_wheel_L", true);
	this.playAnimation("animation_wheel_R", true);
	this.playAnimation("animation_wheel_front", true);
}

Futurgo.prototype.stopWheelAnimations = function() {
	this.stopAnimation("animation_wheel_L");
	this.stopAnimation("animation_wheel_R");
	this.stopAnimation("animation_wheel_front");
}

Futurgo.prototype.toggleWheelAnimations = function() {
	this.wheelsMoving = !this.wheelsMoving;
	if (this.wheelsMoving) {
		this.playWheelAnimations();
	}
	else {
		this.stopWheelAnimations();
	}
}

Futurgo.prototype.getBodyColor = function() {
	var color = '#ffffff';
	if (this.part_materials.length) {
		var material = this.part_materials[0];
		if (material instanceof THREE.MeshFaceMaterial) {
			color = '#' + material.materials[0].color.getHexString();
		}
		else {
			color = '#' + material.color.getHexString();
		}
	}

	return color;
}

Futurgo.prototype.setBodyColor = function(r, g, b) {

	// Convert from hex rgb to float
	r /= 255;
	g /= 255;
	b /= 255;
	
	var i, len = this.part_materials.length;
	for (i = 0; i < len; i++) {
		var material = this.part_materials[i];
		if (material instanceof THREE.MeshFaceMaterial) {
			var j, mlen = material.materials.length;
			for (j = 0; j < mlen; j++) {
				material.materials[j].color.setRGB(r, g, b);
			}
		}
		else {
			material.color.setRGB(r, g, b);
		}
	}		
}


Futurgo.prototype.onMouseOver = function(what, event) {
	if (this.mouseOverCallback)
		this.mouseOverCallback(what, event);
}

Futurgo.prototype.onMouseOut = function(what, event) {
	if (this.mouseOutCallback)
		this.mouseOutCallback(what, event);
}

Futurgo.prototype.onTouchStart = function(what, event) {
	console.log("touch start", what, event);
}

Futurgo.prototype.onTouchEnd = function(what, event) {
	console.log("touch end", what, event);
	this.onMouseOver(what, event);
}

Futurgo.URL = "../models/futurgo/futurgo.json";