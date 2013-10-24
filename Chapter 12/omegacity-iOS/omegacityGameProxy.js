/**
 * @fileoverview Proxy HUD Object
 * @author Tony Parisi
 */

OmegaCityGameProxy = function(param) {
}

OmegaCityGameProxy.prototype.play = function() {
	CocoonJS.App.forwardAsync("playGame();");

}

OmegaCityGameProxy.prototype.leaveState = function(state, data) {
}

OmegaCityGameProxy.prototype.updateMissileCount = function(count) {
}

