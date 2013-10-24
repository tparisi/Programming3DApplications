/**
 * @fileoverview OmegaCity Game Demo
 * @author Tony Parisi
 */

OmegaCity = function(param) {

	this.container = param.container;
	this.loadCallback = param.loadCallback;
	this.loadProgressCallback = param.loadProgressCallback;
	this.hud = param.hud;
	this.sound = param.sound;
	this.fps = 0;
	this.turndir = 0;
	this.turnSpeed = 0.025;
	this.touchStartTime = 0;
	this.firing = false;
	this.lastFireTime = 0;
}

OmegaCity.prototype.load = function() {
	this.viewer = new Vizi.Viewer({ container : this.container, showGrid : false,
		allowPan: true, oneButton: false });
	this.loadURL(OmegaCity.URL);
	this.viewer.run();
	this.viewer.focus();
	this.viewer.mouseDelegate = this;
	this.viewer.touchDelegate = this;
	this.viewer.keyboardDelegate = this;
}

OmegaCity.prototype.loadURL = function(url) {

	var that = this;
	
	var loader = new Vizi.Loader;
	loader.addEventListener("loaded", function(data) { that.onLoadComplete(data, loadStartTime); }); 
	loader.addEventListener("progress", function(progress) { that.onLoadProgress(progress); }); 

	var loadStartTime = Date.now();
	loader.loadScene(url);	
}

OmegaCity.prototype.onLoadComplete = function(data, loadStartTime)
{
	var scene = data.scene;
	this.scene = data.scene;
	this.viewer.replaceScene(data);

	this.showStartScreen();
	this.initPlayers();
	this.initProps();
	this.initTimers();
	
	// Hide the transparent boxes, they're messing with alpha blending of
	// other effects e.g. explosion
	data.scene.map(Vizi.Visual, function(v) {
		if (v.material.opacity == 0) {
			v.visible=false;
		}
	});
	
	if (this.loadCallback) {
		var loadTime = (Date.now() - loadStartTime) / 1000;
		this.loadCallback(loadTime);
	}
}

OmegaCity.prototype.onLoadProgress = function(progress)
{
	// Update the laoder bar
	var percentProgress = progress.loaded / progress.total * 100;
	if (this.loadProgressCallback)
		this.loadProgressCallback(percentProgress);
}

OmegaCity.playerViews = [
		"player1-ext",
		"player1-int",
		"player2-ext",
		"player2-int",
    ];

OmegaCity.currentPlayerView = 0;

OmegaCity.playerCameras = { 
		"player1-ext" : "Camera05",
		"player1-int" : "Camera13",
		"player2-ext" : "Camera15",
		"player2-int" : "Camera09",						
	};

OmegaCity.prototype.showStartScreen = function() {

	var playerView = OmegaCity.playerViews[OmegaCity.currentPlayerView];
	var playerCamera = OmegaCity.playerCameras[playerView];
	this.viewer.useCamera(playerCamera);
	this.viewer.setLoopAnimations(true);
	this.viewer.playAllAnimations();

}

OmegaCity.prototype.initPlayers = function() {

	this.player1Group = this.scene.findNode("_ship-box01");
	this.player1Body = this.player1Group.findNode("FF01");
	this.player2Group = this.scene.findNode("_ship02-box");
	this.player2Body = this.player2Group.findNode("Heli-scout-04");
	this.alienGroup = this.scene.findNode("_ship03-box");
	this.alienBody = this.player1Group.findNode("Alien");
}

OmegaCity.prototype.initProps = function() {

	// Load the missile model
	this.missileStartPosition = new THREE.Vector3(0, -3, 0);
	this.explosionDuration = 2.5;
	
	var that = this;
	var loader = new Vizi.Loader;
	loader.addEventListener("loaded", function(data) { that.onPropsLoadComplete(data); }); 
	var url = OmegaCity.missileURL;
	loader.loadScene(url);

	// Create the explosion effect
	var texture = THREE.ImageUtils.loadTexture("./images/lensflare1.png");
	var sphere = new Vizi.Visual({
		geometry : new THREE.SphereGeometry(20, 32, 32),
		material : new THREE.MeshBasicMaterial({transparent:true, 
			opacity:0.5,
			color:0x00ff00,
			ambient:0xffffff,
			map:texture}),
	});
	this.explosion = new Vizi.Object;
	this.explosion.addComponent(sphere);
	
	var startScale = new THREE.Vector3(0.001, 0.001, 0.001);
	var endScale = new THREE.Vector3(9, 9, 9);
	this.explosionScaler = new Vizi.ScaleBehavior({startScale:startScale, 
		endScale:endScale, 
		duration:this.explosionDuration});
	this.explosion.addComponent(this.explosionScaler);
	
	this.player1Group.addChild(this.explosion);
	sphere.visible = false;

	// Create the laser effect
	this.laserFireDuration = 0.1;
	this.lastLaserFireTime = 0;
	
	this.lasers = new Vizi.Object;
	
	var laser1 = new Vizi.Object;
	var texture = THREE.ImageUtils.loadTexture("./images/laser.png");
	var cylinder = new Vizi.Visual({
		geometry : new THREE.CylinderGeometry(0.05, 0.05, 10),
		material : new THREE.MeshBasicMaterial({transparent:true, 
			opacity:0.8,
			ambient:0xffffff,
			map:texture}),
	});
	
	laser1.addComponent(cylinder);
	
	var startScale = new THREE.Vector3(1, 0.001, 1);
	var endScale = new THREE.Vector3(1, 10, 1);
	this.laserScaler1 = new Vizi.ScaleBehavior({startScale:startScale, 
		endScale:endScale,
		duration:this.laserFireDuration});
	laser1.addComponent(this.laserScaler1);
	
	laser1.transform.rotation.x = -Math.PI / 2;
	laser1.transform.rotation.z = Math.PI / 24;
	laser1.transform.position.y = -5;
	laser1.transform.position.x = 4.3;
	laser1.transform.position.z = 10;
	
	this.lasers.addChild(laser1);
	this.laser1 = laser1;

	var laser2 = new Vizi.Object;

	var cylinder = new Vizi.Visual({
		geometry : new THREE.CylinderGeometry(0.05, 0.05, 10),
		material : new THREE.MeshBasicMaterial({transparent:true, 
			opacity:0.8,
			ambient:0xffffff,
			map:texture}),
	});
	
	laser2.addComponent(cylinder);
	
	var startScale = new THREE.Vector3(1, 0.001, 1);
	var endScale = new THREE.Vector3(1, 10, 1);
	this.laserScaler2 = new Vizi.ScaleBehavior({startScale:startScale, 
		endScale:endScale,
		duration:this.laserFireDuration});
	laser2.addComponent(this.laserScaler2);
	
	laser2.transform.rotation.x = Math.PI / 2;
	laser2.transform.rotation.z = Math.PI / 48;
	laser2.transform.position.y = -5;
	laser2.transform.position.x = -5.67;
	laser2.transform.position.z = 10;
	
	this.lasers.addChild(laser2);
	this.laser2 = laser2;
	
	this.player1Group.addChild(this.lasers);

	// hide these to start
	this.laser1.visuals[0].visible = false;
	this.laser2.visuals[0].visible = false;

}

OmegaCity.prototype.onPropsLoadComplete = function(data) {
	
	// Missile model loaded, add it to the scene with some behaviors
	var missile = data.scene;
	missile.transform.rotation.y = -Math.PI / 2;
	missile.transform.scale.set(.6, .6, .6);
	missile.transform.position.copy(this.missileStartPosition);
	
	var duration = 3.667;
	var mover = new Vizi.MoveBehavior({duration:duration, 
		moveVector:new THREE.Vector3(-20, 1, -duration * 50)});
	var that = this;
	mover.addEventListener("complete", function() {
		that.onMissileFireComplete();
	});
	missile.addComponent(mover);
		
	this.player1Group.addChild(missile);

	this.player1Missile = missile;
	this.player1MissileLauncher = mover;	
}

OmegaCity.prototype.initTimers = function() {

	// Main clock to drive evaluate
	var clock = new Vizi.Object;
	var timer = new Vizi.Timer({
		loop : true
	});

	var that = this;
	timer.addEventListener("time", function() {
		that.evaluate();
	});
	
	clock.addComponent(timer);
	
	this.viewer.addObject(clock);

	this.mainTimer = timer;

	// Automated no info message
	var NOINFO_DURATION = 40000; // ms
	
	var clock = new Vizi.Object;
	var timer = new Vizi.Timer({
		loop : false,
		duration : NOINFO_DURATION,
	});
	
	var that = this;
	timer.addEventListener("cycleTime", function() {
			that.enterState("noInformation");
			that.noInformationTimer.stop();
	});
	
	clock.addComponent(timer);
	
	this.viewer.addObject(clock);
	
	this.noInformationTimer = timer;
}

OmegaCity.prototype.play = function() {

	var playerCamera = OmegaCity.playerCameras["player1-int"];
	this.viewer.useCamera(playerCamera);

	var that = this;
	this.viewer.addEventListener("renderstats", function(stats) { that.onRenderStats(stats); });
	
	this.state = "";
	this.missileCount = 25;
	
	this.viewer.focus();

	this.mainTimer.start();
	this.noInformationTimer.start();

	this.elapsedTime = 0;
	this.startTime = Date.now();
}

OmegaCity.MAX_TURN_RIGHT = Math.PI / 8;
OmegaCity.MAX_TURN_LEFT = -Math.PI / 8;

OmegaCity.prototype.evaluate = function() {
	
	// Free navigation was a bust with these animations in place-- later
	if (false) {
		var delta = this.turnSpeed * this.turndir;
		this.player1.transform.rotation.y += delta;
		if (this.player1.transform.rotation.y > OmegaCity.MAX_TURN_RIGHT) {
			this.player1.transform.rotation.y = OmegaCity.MAX_TURN_RIGHT
		}
		if (this.player1.transform.rotation.y < OmegaCity.MAX_TURN_LEFT) {
			this.player1.transform.rotation.y = OmegaCity.MAX_TURN_LEFT
		}
	}
	
	var now = Date.now();
	this.elapsedTime = now - this.startTime;
	
	var player1pos = this.player1Group.transform.position;
	var alienpos = this.alienGroup.transform.position;
	var distance = player1pos.distanceTo(alienpos);
	
	var DANGER_ZONE = 700;
	if (distance < DANGER_ZONE) {
//		console.log("Alien distance: ", distance);
		this.enterState("proximityAlert");
	}
	else {
		this.leaveState("proximityAlert");
	}
	
	if (this.launching) {

		this.enterState("fireMissile");
		this.launching = false;
	}

	if (this.touched) {
		var touchDelta = now - this.touchStartTime;
		if (this.touchStartTime && (touchDelta >= OmegaCity.DOUBLETAP_DELAY)) {
			this.firing = true;
			this.launching = false;
		}
		
		if (this.firing) {
			
			var deltafire = now - this.lastFireTime;
			if (deltafire >= OmegaCity.FIRING_INTERVAL) {
				this.enterState("fireLasers");
				this.lastFireTime = now;
			}
		}
	}
}

OmegaCity.prototype.onRenderStats = function(stats) {
	this.fps = stats.fps;
}

OmegaCity.prototype.enterState = function(state) {
	
	switch (state) {
	
		case "fireLasers" :
			this.fireLasers();
			break;
		
		case "fireMissile" :
			this.fireMissile();
			break;

		case "proximityAlert" :
			if (this.state != "proximityAlert" && this.state != "noInformation")
				this.proximityAlert();
			else
				return;
			break;	

		case "noInformation" :
			this.noInformation();
			break;	
	
	}
	
	this.state = state;
}

OmegaCity.prototype.leaveState = function(state) {

	switch (state) {
	
		case "proximityAlert" :
			if (this.state == "proximityAlert")
				this.endProximityAlert();
			break;
	
		case "noInformation" :
			if (this.state == "noInformation")
				this.endNoInformation();
			break;	
	}
	
	this.state = "";
}

OmegaCity.prototype.fireLasers = function() {
	
	this.sound.enterState("fireLasers");
	
	// Try the laser animation... but only if the previous one isn't done yet
	var padding = 200;
	var now = Date.now();
	var durationms = this.laserFireDuration * 1000;
	if ((now - this.lastLaserFireTime) < (durationms + padding)) {
		return;
	}
	
	this.lastLaserFireTime = now;
	
	var that = this;
	
	this.laserScaler1.stop();
	this.laserScaler2.stop();
	
	this.laser1.visuals[0].visible = true;
	this.laser2.visuals[0].visible = true;
	
	this.laserScaler1.start();
	this.laserScaler2.start();

	var that = this;
	setTimeout(function() {
		// hide the lasers and reset the scale
		that.laser1.visuals[0].visible = false;
		that.laser2.visuals[0].visible = false;
		that.laser1.transform.scale.set(1, 1, 1);
		that.laser2.transform.scale.set(1, 1, 1);
	}, durationms);
	
}

OmegaCity.prototype.fireMissile = function() {
	this.sound.enterState("fireMissile");
	
	var that = this;
	setTimeout(function() {
		that.player1MissileLauncher.start();
	}, 
	this.sound.missileFireDelayTime);	
	
	this.hud.updateMissileCount(--this.missileCount);
}

OmegaCity.prototype.proximityAlert = function() {
	this.sound.enterState("alert", "proximity");
	this.hud.enterState("alert", "proximity");
}

OmegaCity.prototype.endProximityAlert = function() {
	this.sound.leaveState("alert", "proximity");
	this.hud.leaveState("alert", "proximity");
}

OmegaCity.prototype.noInformation = function() {
	this.sound.enterState("alert", "noInformation");
	this.hud.enterState("alert", "noInformation");
}

OmegaCity.prototype.endNoInformation = function() {
	this.sound.leaveState("alert", "noInformation");
	this.hud.leaveState("alert", "noInformation");
}


OmegaCity.prototype.onMissileFireComplete = function() {
	this.explosion.transform.position.copy(this.player1Missile.transform.position);
	this.explosion.visuals[0].visible = true;
	this.explosionScaler.start();

	var that = this;
	setTimeout(function() {
		that.explosion.transform.scale.set(1, 1, 1);
		that.explosion.visuals[0].visible = false;
	}, (this.explosionDuration + 1) * 1000);
	
	this.player1Missile.transform.position.copy(this.missileStartPosition);
	this.sound.enterState("explosion");
}

OmegaCity.prototype.turn = function(dir) {
	this.turndir = dir;
}

OmegaCity.prototype.onMouseDown = function(event) {
	this.viewer.focus();
}

OmegaCity.prototype.onMouseOver = function(event) {
}

OmegaCity.prototype.onMouseOut = function(event) {
}

OmegaCity.prototype.onMouseMove = function(event) {
}

OmegaCity.prototype.onMouseUp = function(event) {
}

OmegaCity.prototype.onMouseClick = function(event) {
}

OmegaCity.prototype.onMouseDoubleClick = function(event) {
}

OmegaCity.prototype.onTouchStart = function(event) {
	var now = Date.now();
	var tapDelay = now - this.touchStartTime;

	if (this.touchStartTime && (tapDelay <= OmegaCity.DOUBLETAP_DELAY)) {
		this.launching = true;
		this.firing = false;
	}

	this.touched = true;
	this.touchStartTime = now;
}

OmegaCity.prototype.onTouchEnd = function(event) {
	
	this.touched = false;
	this.firing = false;
}

OmegaCity.prototype.onKeyPress = function(event) {
	
}

OmegaCity.prototype.onKeyDown = function(event) {
	
	if (event.keyCode == Vizi.Keyboard.KEY_UP) {
		this.enterState("fireLasers");
	}
	
	if (event.keyCode == Vizi.Keyboard.KEY_LEFT) {
//		this.turn(-1);
	}
	
	if (event.keyCode == Vizi.Keyboard.KEY_RIGHT) {
//		this.turn(1);
	}
	
	var chr = String.fromCharCode(event.keyCode);
	var chr = String.fromCharCode(event.keyCode);
	if (chr == ' ') {
		this.enterState("fireMissile");
	}
}

OmegaCity.prototype.onKeyUp = function(event) {
	if (event.keyCode == Vizi.Keyboard.KEY_LEFT) {
		this.turn(0);
	}
	
	if (event.keyCode == Vizi.Keyboard.KEY_RIGHT) {
		this.turn(0);
	}
	
	
}

OmegaCity.URL = "./models/vc/vc.json";
OmegaCity.missileURL = "./models/missile/missile-fixed.json";
OmegaCity.FIRING_INTERVAL = 100; // ms
OmegaCity.DOUBLETAP_DELAY = 250; // ms