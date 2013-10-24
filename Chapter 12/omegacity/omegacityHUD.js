/**
 * @fileoverview OmegaCity HUD Manager
 * @author Tony Parisi
 */

OmegaCityHUD = function(param) {

	this.game = param.game;
	this.game.hud = this;
	
	this.container = document.getElementById("container");
	this.loadStatus = document.getElementById("loadStatus");
	this.startScreen = document.getElementById("startScreen");
	this.initPlayScreenElements();
}

OmegaCityHUD.prototype.enterState = function(state, data) {
	switch (state) {
		case "load" :
			this.enterLoadScreen();
			break;
		case "start" :
			this.enterStartScreen();
			break;
		case "play" :
			this.enterPlayScreen();
			break;
		case "alert" :
			this.showAlert(data);
			break;
	}
}

OmegaCityHUD.prototype.leaveState = function(state, data) {
	switch (state) {
		case "alert" :
			this.hideAlert(data);
			break;
	}
}

OmegaCityHUD.prototype.enterLoadScreen = function() {
	this.loadStatus.style.display = 'block';
	this.startScreen.style.display = 'none';
}

OmegaCityHUD.prototype.enterStartScreen = function() {
	this.loadStatus.style.display = 'none';
	this.startScreen.style.display = 'block';
}

OmegaCityHUD.prototype.enterPlayScreen = function() {
	this.loadStatus.style.display = 'none';
	this.startScreen.style.display = 'none';
	this.showPlayScreen();
	this.runMessageCenter();
}

OmegaCityHUD.prototype.initPlayScreenElements = function() {

	this.playScreen = {};
	
	var elements = OmegaCityHUD.playScreenElements, 
		len = elements.length;
	
	for (var i = 0; i < len; i++) {
		this.playScreen[elements[i]] = document.getElementById(elements[i]);
	}
}

OmegaCityHUD.prototype.showPlayScreen = function() {

	var element;
	for (element in this.playScreen) {
		this.playScreen[element].style.display = 'block';
	}
}

OmegaCityHUD.prototype.updateMissileCount = function(count) {
	this.playScreen.ammo_count.innerHTML = "x" + count; 
}

OmegaCityHUD.prototype.runMessageCenter = function() {
	this.lastMessageTime = 0;
	this.messageIndex = 0;
	this.messageInterval = 5000; // ms
	this.alertMessage = "";
	this.messageCenterLoop();
}

OmegaCityHUD.prototype.messageCenterLoop = function() {
	var that = this;
	requestAnimationFrame(function() {
		that.messageCenterLoop();
	});

	var now = Date.now();
	var deltat = now - this.lastMessageTime;
	if (deltat < this.messageInterval)
		return;
	
	this.lastMessageTime  = now;

	if (this.messageIndex >= OmegaCityHUD.messages.length) {
		this.messageIndex = 0;
	}
	
	var prefix = "[HQ Priority One]<br>";
	var message = prefix + OmegaCityHUD.messages[this.messageIndex++];
	
	this.playScreen.message_content.innerHTML = message;
	
	$('#message_content').addClass("scroller");
	setTimeout(function() { 
		$('#message_content').removeClass("scroller");		
	}, 2000);

}


OmegaCityHUD.prototype.showAlert = function(index) {
	this.playScreen.message_alert.style.display = 'block';
	this.playScreen.message_alert.innerHTML = OmegaCityHUD.alertMessages[index];
}

OmegaCityHUD.prototype.hideAlert = function(index) {
	this.playScreen.message_alert.style.display = 'none';
	this.playScreen.message_alert.innerHTML = "";
	console.log("hiding alert");
}

OmegaCityHUD.playScreenElements = [
     "inventory",
     "nav",
     "objectives",
     "menu",
     "message",
     "message_portrait",
     "message_content",
     "message_alert",
     "ammo",
     "ammo_count",
     "ammo_label",
     "speed",
     "speed_value",
     "speed_label",
     "fuel",
     "fuel_value",
     "map",
     "shields",
     "health_label",
     "health_value",
     "shields_label",
     "shields_value",
     "target",
     "help_text",
];

OmegaCityHUD.messages = [
    'All units: LR sensors show alient craft approaching city limits',                    
    'Alpha-One: alien craft in your vacinity',                    
    'Alpha-One: lay down cover pattern',                    
    'Alpha-One: Scan craft and report via P1-S uplink', 
    'Alpha-One: Secure the City at all costs', 
    'Alpha-One: lay down cover pattern',                    
    'Alpha-One: Scan craft and report via P1-S uplink', 
    'Alpha-One: lay down cover pattern',                    
];

OmegaCityHUD.alertMessages = {
    'proximity' : 'PROXIMITY ALERT: TARGET NEARBY',
	'noInformation' : 'SCANNER: NO INFORMATION AVAILABLE',
	'allunits' : 'ATTENTION ALL UNITS',
}

