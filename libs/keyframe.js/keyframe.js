// KeyFrame utility - Simple Key Frame Animation plus Tween.js Easing
var KF = KF || ( function () {

	var animators = [];

	return	{
		add : function(animator)
		{
			animators.push(animator);
		},

		remove: function(animator)
		{

			var i = animators.indexOf(animator);

			if ( i !== -1 ) {
				animators.splice( i, 1 );
			}
		},

		update : function()
		{
			for (i = 0; i < animators.length; i++)
			{
				animators[i].update();
			}
		},
	};
})();

// Construction/initialization
KF.KeyFrameAnimator = function() 
{
	this.interps = [];
	this.running = false;
}

KF.KeyFrameAnimator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.interps)
	{
		this.createInterpolators(param.interps);
	}	    		

	this.duration = param.duration ? param.duration : KF.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
	this.easing = param.easing;
}

KF.KeyFrameAnimator.prototype.createInterpolators = function(interps)
{
	var i, len = interps.length;
	for (i = 0; i < len; i++)
	{
		var param = interps[i];
		var interp = new KF.Interpolator();
		interp.init({ keys: param.keys, values: param.values, target: param.target });
		this.interps.push(interp);
	}
}

// Start/stop
KF.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
	KF.add(this);
}

KF.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	KF.remove(this);
}

// Update - drive key frame evaluation
KF.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;
	if (this.easing)
		fract = this.easing(fract);
	
	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		KF.remove(this);
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}
// Statics
KF.KeyFrameAnimator.default_duration = 1000;

//Interpolator class
//Construction/initialization
KF.Interpolator = function() 
{
	    		
	this.keys = [];
	this.values = [];
	this.target = null;
	this.running = false;
}
	
KF.Interpolator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.keys && param.values)
	{
		this.setValue(param.keys, param.values);
	}	    		

	this.target = param.target ? param.target : null;
}

KF.Interpolator.prototype.setValue = function(keys, values)
{
	this.keys = [];
	this.values = [];
	if (keys && keys.length && values && values.length)
	{
		this.copyKeys(keys, this.keys);
		this.copyValues(values, this.values);
	}
}

//Copying helper functions
KF.Interpolator.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

KF.Interpolator.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

KF.Interpolator.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

//Interpolation and tweening methods
KF.Interpolator.prototype.interp = function(fract)
{
	var value;
	var i, len = this.keys.length;
	if (fract == this.keys[0])
	{
		value = this.values[0];
	}
	else if (fract >= this.keys[len - 1])
	{
		value = this.values[len - 1];
	}

	for (i = 0; i < len - 1; i++)
	{
		var key1 = this.keys[i];
		var key2 = this.keys[i + 1];

		if (fract >= key1 && fract <= key2)
		{
			var val1 = this.values[i];
			var val2 = this.values[i + 1];
			value = this.tween(val1, val2, (fract - key1) / (key2 - key1));
		}
	}
	
	if (this.target)
	{
		this.copyValue(value, this.target);
	}
}

KF.Interpolator.prototype.tween = function(from, to, fract)
{
	var value = {};
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		var range = to[property] - from[property];
		var delta = range * fract;
		value[ property ] = from[ property ] + delta;
	}
	
	return value;
}
