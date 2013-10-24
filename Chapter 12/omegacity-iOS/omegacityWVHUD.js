/**
 * @fileoverview Proxy HUD Object
 * @author Tony Parisi
 */

ProxyHUD = function(param) {
	this.game = param.game;
	this.game.hud = this;
}

ProxyHUD.prototype.enterState = function(state, data) {
	CocoonJS.App.forwardAsync("enterState(" + state + "," + data + ");");

}

ProxyHUD.prototype.leaveState = function(state, data) {
}

ProxyHUD.prototype.updateMissileCount = function(count) {
}

