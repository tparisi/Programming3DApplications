/**
 * @fileoverview Proxy HUD Object
 * @author Tony Parisi
 */

ProxySound = function(param) {
}

ProxySound.prototype.enterState = function(state, data) {
	CocoonJS.App.forward("soundEnterState('" + state + "','" + data + "');");

}

ProxySound.prototype.leaveState = function(state, data) {
}

