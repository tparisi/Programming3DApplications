/**
 * @fileoverview OmegaCity HUD Manager
 * @author Tony Parisi
 */

OmegaCitySound = function(param) {

	this.game = param.game;
	this.game.sound = this;
	
	this.loadSounds();
	
	this.entryNoise = document.getElementById("entry_noise");
	this.entryMusic = document.getElementById("entry_music");
	this.engines = document.getElementById("engines");
	this.laser = document.getElementById("laser");
	this.missile = document.getElementById("missile");
	this.powerUp = document.getElementById("power_up");
	this.missileLockedOn = document.getElementById("missile_locked_on");
	this.explosion = document.getElementById("explosion");
	this.proximityAlert = document.getElementById("proximity_alert");
	this.noinformationAlert = document.getElementById("no_information");
	
	this.entryNoise.volume = 0.2;
	this.entryNoise.loop = true;

	this.entryMusic.volume = 0.5;	
	this.entryMusic.loop = true;

	this.engines.volume = 0.0;
	this.engines.loop = true;

	this.laser.volume= 0.5;
	this.missile.volume= 0.5;
	this.missileLockedOn.volume= 0.25;
	this.powerUp.volume= 0.75;
	this.proximityAlert.volume= 0.5;
	this.proximityAlert.loop = false;
	this.noinformationAlert.volume= 0.3;
	this.noinformationAlert.loop = false;
	
	this.entryFadeTime = 10000; // ms
	this.missileFireDelayTime = 2000; // ms
	this.missileLockedOnDelayTime = 500; // ms
}

OmegaCitySound.prototype.enterState = function(state, data) {
	
	switch (state) {
		case "load" :
			break;
		case "start" :
			this.playStartMusic();
			break;
		case "play" :
			this.playGame();
			break;
		case "fireLasers" :
			this.fireLasers();
			break;
		case "fireMissile" :
			this.fireMissile();
			break;
		case "explosion" :
			this.playExplosion();
			break;
		case "alert" :
			this.playAlert(data);
			break;
	}
}

OmegaCitySound.prototype.leaveState = function(state, data) {
	
	switch (state) {
	case "alert" :
		this.stopAlert(data);
		break;
	}
}

OmegaCitySound.prototype.playStartMusic = function() {
	this.entryNoise.play();
	this.entryMusic.play();
}

OmegaCitySound.prototype.playGame = function() {

	// Fade entry music
//	$(this.entryMusic).animate({volume: 0.0}, this.entryFadeTime);	
	// Fade entry noise
//	$(this.entryNoise).animate({volume: 0.0}, this.entryFadeTime);	
	this.entryMusic.volume = 0;
	this.entryNoise.volume = 0;
	
	var that = this;
	setTimeout(function() {
		that.entryMusic.pause();
		that.entryNoise.pause();
	}, this.entryFadeTime);
	
	this.engines.play();
	this.engines.volume = 0.5;
//	$(this.engines).animate({volume: 0.5}, 1000);
	
}

OmegaCitySound.prototype.fireLasers = function() {
	this.laser.pause();
	this.laser.currentTime = 0;
	this.laser.play();
}

OmegaCitySound.prototype.fireMissile = function() {

	this.missile.pause();
	this.powerUp.pause();
	this.missileLockedOn.pause();

	this.missile.currentTime = 0;
	this.powerUp.currentTime = 0;
	this.missileLockedOn.currentTime = 0;

	this.powerUp.volume=0.75;
	this.powerUp.play();
	var that = this;

	/*
	setTimeout(function() { 
		that.missileLockedOn.play(); 
		$(that.powerUp).animate({volume: 0.0}, 1000);},
			that.missileLockedOnDelayTime);
	*/
	
	setTimeout(function() { 
		that.missile.play(); 
		//$(that.powerUp).animate({volume: 0.0}, 1000);},
		that.powerUp.volume = 0; },
			that.missileFireDelayTime);
}

OmegaCitySound.prototype.playExplosion = function() {
	this.explosion.pause();
	this.explosion.currentTime = 0;
	this.explosion.play();
}

OmegaCitySound.prototype.playAlert = function(name) {
	switch (name) {
		case "proximity" :
			if (this.proximityAlert.currentTime > 0)
				return;
			this.proximityAlert.play();
			break;
		case "noInformation" :
			this.noinformationAlert.pause();
			this.noinformationAlert.currentTime = 0;
			this.noinformationAlert.play();
			break;
	}
}

OmegaCitySound.prototype.stopAlert = function(name) {
	switch (name) {
		case "proximity" :
			this.proximityAlert.pause();
			this.proximityAlert.currentTime = 0;
			break;
		case "noInformation" :
			this.noinformationAlert.pause();
			this.noinformationAlert.currentTime = 0;
			break;
	}
}

OmegaCitySound.prototype.loadSounds = function() {
	// CocoonJS workaround for not parsing HTML audio correctly

	var sources = OmegaCitySound.sources,
		i = 0, len = sources.length;
	
	for (i = 0; i < len; i++) {
		var audio = new Audio();
		audio.id = sources[i].id;
		audio.src = sources[i].src;
		document.body.appendChild(audio);	
	}
}

OmegaCitySound.sources = [
                          { id : "entry_noise", src : "./sounds/entrynoise.ogg" },
                          { id : "entry_music", src : "./sounds/entrymusic.mp3" },
                          { id : "engines", src : "./sounds/enginesturbinesone.ogg" },
                          { id : "laser", src : "./sounds/shortlaser.wav" },
                          { id : "missile", src : "./sounds/missile-firing-fl.mp3" },
                          { id : "power_up", src : "./sounds/flash-sound-jet.ogg" },
                          { id : "missile_locked_on", src : "./sounds/missile-lock-on-sound.mp3" },
                          { id : "explosion", src : "./sounds/explosion4-trimmed.wav" },
                          { id : "proximity_alert", src : "./sounds/proximity-alert.wav" },
                          { id : "no_information", src : "./sounds/no-information.wav" },
                          ];

