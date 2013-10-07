var sources = [
               //http://www.freesound.org/people/synthetic-oz/sounds/162704/
               "./sounds/162704__synthetic-oz__city-air-with-car-bumps.wav",
               "./sounds 162704__synthetic-oz__city-trimmed-looped.wav",
               // http://www.freesound.org/people/Calethos/sounds/31126/
               "./sounds/31126__calethos__bump.wav",
               // http://www.freesound.org/people/Millavsb/sounds/197874/
               "./sounds/197874__millavsb__refrigerator-motor.wav",
               ];

FuturgoSound = function(param) {

	this.citySound = document.getElementById("city_sound");
	this.citySound.volume = FuturgoSound.CITY_VOLUME;
	this.citySound.loop = true;
	
	this.bumpSound = document.getElementById("bump_sound");
	this.bumpSound.volume = FuturgoSound.BUMP_VOLUME;
}

FuturgoSound.prototype.start = function() {

	this.citySound.play();

}

FuturgoSound.prototype.bump = function() {
	
	this.bumpSound.play();

}

FuturgoSound.prototype.interior = function() {

	$(this.citySound).animate(
			{volume: FuturgoSound.CITY_VOLUME_INTERIOR}, 
			FuturgoSound.FADE_TIME);	
}

FuturgoSound.prototype.exterior = function() {

	$(this.citySound).animate(
			{volume: FuturgoSound.CITY_VOLUME}, 
			FuturgoSound.FADE_TIME);	
}

FuturgoSound.prototype.bump = function() {
	
	this.bumpSound.play();

}

FuturgoSound.CITY_VOLUME = 0.3;
FuturgoSound.CITY_VOLUME_INTERIOR = 0.15;
FuturgoSound.BUMP_VOLUME = 0.3;
FuturgoSound.FADE_TIME = 1000;
