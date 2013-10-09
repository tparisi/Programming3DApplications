/*
 * controller script for futurgo vehicle
 * extends Vizi.Script
 */

FuturgoController = function(param)
{
	param = param || {};
	
	Vizi.Script.call(this, param);

	this.enabled = (param.enabled !== undefined) ? param.enabled : true;
	this.scene = param.scene || null;
	
	this.turnSpeed = Math.PI / 2; // 90 degs/sec

	this.moveForward = false;
	this.moveBackward = false;
	this.turnLeft = false;
	this.turnRight = false;
	
	this.accelerate = false;
	this.brake = false;
	this.acceleration = 0;
	this.braking = 0;
	this.speed = 0;
	this.rpm = 0;
	
	this.eyePosition = new THREE.Vector3;
	this.downVector = new THREE.Vector3(0, -1, 0);
	this.groundY = 0;
	this.avatarHeight = FuturgoCity.AVATAR_HEIGHT_SEATED;
		
	this.savedPos = new THREE.Vector3;	
	this.movementVector = new THREE.Vector3;	

	this.lastUpdateTime = Date.now();
	this.accelerateStartTime = this.brakeStartTime = 
		this.accelerateEndTime = this.brakeEndTime = 
		this.lastUpdateTime;
}

goog.inherits(FuturgoController, Vizi.Script);

FuturgoController.prototype.realize = function()
{
	this.lastUpdateTime = Date.now();

	// Save ground position
	this.groundY = this._object.transform.position.y;
	
	// Add a bounce behavior to run on collide
	this.bouncer = new Vizi.BounceBehavior(
			{ duration : FuturgoController.BOUNCE_DURATION }
			);
	this._object.addComponent(this.bouncer);	
}

FuturgoController.prototype.update = function()
{
	if (!this.enabled)
		return;
	
	var now = Date.now();
	var deltat = now - this.lastUpdateTime;

	this.savePosition();
	this.updateSpeed(now, deltat);
	this.updatePosition(now, deltat);	
	this.testCollision();
	this.testTerrain();
	
	this.lastUpdateTime = now;
}

FuturgoController.prototype.updateSpeed = function(now, deltat) {
	
	var speed = this.speed, rpm = this.rpm;
	
	// Accelerate if the pedal is down
	if (this.accelerate) {
		var deltaA = now - this.accelerateStartTime;
		this.acceleration = deltaA / 1000 * FuturgoController.ACCELERATION;		
	}
	else {
		// Apply momentum
		var deltaA = now - this.accelerateEndTime;
		this.acceleration -= deltaA / 1000 * FuturgoController.INERTIA;		
		this.acceleration = Math.max( 0, Math.min( FuturgoController.MAX_ACCELERATION, 
			this.acceleration) );
	}

	speed += this.acceleration;
	
	// Slow down if the brake is down
	if (this.brake) {
		var deltaB = now - this.brakeStartTime;
		var braking = deltaB / 1000 * FuturgoController.BRAKING;

		speed -= braking;
	}
	else {
		// Apply inertia
		var inertia = deltat / 1000 * FuturgoController.INERTIA;
		speed -= inertia;
	}
	
	speed = Math.max( 0, Math.min( FuturgoController.MAX_SPEED, speed ) );
	rpm = Math.max( 0, Math.min( FuturgoController.MAX_ACCELERATION, this.acceleration ) );

	if (this.speed != speed) {
		this.speed = speed;
		this.dispatchEvent("speed", speed);
	}
	
	if (this.rpm != rpm) {
		this.rpm = rpm;
		this.dispatchEvent("rpm", rpm);
	}
}

FuturgoController.prototype.updatePosition = function(now, deltat) {

	var actualMoveSpeed = deltat / 1000 * this.speed;
	var actualTurnSpeed = deltat / 1000 * this.turnSpeed;

	// Translate in Z...
	this._object.transform.object.translateZ( -actualMoveSpeed );
	
	// ...but keep the vehicle on the ground
	this._object.transform.position.y = this.groundY;

	// Turn
	if ( this.turnLeft ) {
		this._object.transform.object.rotateY( actualTurnSpeed );
	}
	
	if ( this.turnRight ) {
		this._object.transform.object.rotateY( -actualTurnSpeed );
	}
	
}

FuturgoController.prototype.savePosition = function() {
	this.savedPos.copy(this._object.transform.position);
}

FuturgoController.prototype.restorePosition = function() {
	this._object.transform.position.copy(this.savedPos);
}

FuturgoController.prototype.testCollision = function() {
	
	this.movementVector.copy(this._object.transform.position).sub(this.savedPos);
	this.eyePosition.copy(this.savedPos);
	this.eyePosition.y = this.groundY + this.avatarHeight;
	
	var collide = null;
	if (this.movementVector.length()) {

        collide = Vizi.Graphics.instance.objectFromRay(this.scene, this.eyePosition,
        		this.movementVector, 
        		FuturgoController.COLLISION_MIN, 
        		FuturgoController.COLLISION_MAX);

        if (collide && collide.object) {
        	var dist = this.eyePosition.distanceTo(collide.hitPointWorld);
        }
	}
	
	if (collide && collide.object) {
		this.handleCollision(collide);
	}
	
}

FuturgoController.prototype.handleCollision = function(collide) {

	// Tell any listeners
	this.dispatchEvent("collide", collide);
	
	// Move back to previously saved position
	this.restorePosition();
	
	// Run the bounce response
	this.bouncer.bounceVector
		.copy(this.movementVector)
		.negate()
		.multiplyScalar(.333);
	this.bouncer.start();

	// Kill the motor
	this.speed = 0;
	this.rpm = 0;
}

FuturgoController.prototype.testTerrain = function() {
	
	var EPSILON = 0.00001;
	
	var terrainHit = Vizi.Graphics.instance.objectFromRay(this.scene, 
				this.eyePosition,
        		this.downVector);

    if (terrainHit && terrainHit.object) {
    	var dist = this.eyePosition.distanceTo(terrainHit.hitPointWorld);
		var diff = this.avatarHeight - dist;		
		if (Math.abs(diff) > EPSILON) {
    		console.log("distance", dist);
    		
    		
    		this.eyePosition.y += diff;
    		this._object.transform.position.y += diff;
    		this.groundY = this._object.transform.position.y;
    	}
    }
}


// Keyboard handlers
FuturgoController.prototype.onKeyDown = function(event) {

	//event.preventDefault();

	switch (event.keyCode) {

		case 38: /*up*/
		case 87: /*W*/
			this.moveForward = true; 
			if (!this.accelerate) {
				this.accelerateStartTime = Date.now();
				this.accelerate = true; 
			}
			break;

		case 37: /*left*/
		case 65: /*A*/ 
			this.turnLeft = true; 
			break;

		case 40: /*down*/
		case 83: /*S*/
			this.moveBackward = true;
			if (!this.brake) {
				this.brakeStartTime = Date.now();
				this.brake = true; 
			}
			break;

		case 39: /*right*/
		case 68: /*D*/
			this.turnRight = true; 
			break;

	}

}

FuturgoController.prototype.onKeyUp = function(event) {

	switch(event.keyCode) {

		case 38: /*up*/
		case 87: /*W*/
			this.moveForward = false;
			if (this.accelerate) {
				this.accelerate = false; 
				this.accelerateEndTime = Date.now(); 
			}
			break;

		case 37: /*left*/
		case 65: /*A*/
			this.turnLeft = false; 
			break;

		case 40: /*down*/
		case 83: /*S*/
			this.moveBackward = false; 
			if (this.brake) {
				this.brake = false; 
				this.brakeEndTime = Date.now(); 
			}
			break;

		case 39: /*right*/
		case 68: /*D*/ 
			this.turnRight = false; 
			break;

	}

}

FuturgoController.prototype.onKeyPress = function(event) {
}

FuturgoController.ACCELERATION = 2; // m/s
FuturgoController.BRAKING = 1.5; // m/s
FuturgoController.INERTIA = 12; // m/s
FuturgoController.COLLISION_MIN = 1; // m
FuturgoController.COLLISION_MAX = 2; // m
FuturgoController.MAX_SPEED = 24; // m/s
FuturgoController.MAX_ACCELERATION = 24; // m/s
FuturgoController.BOUNCE_DURATION = 0.5; // sec
