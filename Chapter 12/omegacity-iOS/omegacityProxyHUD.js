/**
 * @fileoverview Proxy HUD Object
 * @author Tony Parisi
 */

ProxyHUD = function(param) {
	this.game = param.game;
	this.game.hud = this;
}

ProxyHUD.prototype.enterState = function(state, data) {
	
	if (state == "play") {
		console.log("disabling Touch in the web view");
		CocoonJS.App.disableTouchInTheWebView();
	}
	
	CocoonJS.App.forwardAsync("hudEnterState('" + state + "','" + data + "');");

}

ProxyHUD.prototype.leaveState = function(state, data) {
}

ProxyHUD.prototype.updateMissileCount = function(count) {
	CocoonJS.App.forwardAsync("hudUpdateMissileCount(" + count +  ");");
}

