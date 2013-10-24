(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
    * This namespace represents the CocoonJS Advertisement extension API.
    * @namespace
    */
    CocoonJS.Ad = {};

    CocoonJS.Ad.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.IDTK_SRV_AD !== 'undefined';

    /**
    * The predefined possible layouts for a banner ad.
    * @namespace 
    */
	CocoonJS.Ad.BannerLayout = 
	{
		/**
		* Specifies that the banner must be shown in the top of the screen and vertically centered.
		*/
	    TOP_CENTER      : "TOP_CENTER",

		/**
		* Specifies that the banner must be shown in the bottom of the screen and vertically centered.
		*/
	    BOTTOM_CENTER   : "BOTTOM_CENTER"
	};

	/**
    * A rectangle object that contains the banner dimensions
    * @namespace 
    * @constructor
    * @param {int} x The top lef x coordinate of the rectangle.
    * @param {int} y The top lef y coordinate of the rectangle.
    * @param {width} y The rectangle width.
    * @param {height} y The rectangle height.
    */
	CocoonJS.Ad.Rectangle = function(x, y, width, height) 
	{
		/**
		* The top lef x coordinate of the rectangle 
		* @field 
		* @type {int}
		*/
	    this.x = x;

		/**
		* The top lef y coordinate of the rectangle 
		* @field 
		* @type {int}
		*/
	    this.y = y;

	    /**
		* The rectangle width
		* @field 
		* @type {int}
		*/
	    this.width = width;

	    /**
		* The rectangle height
		* @field 
		* @type {int}
		*/
	    this.height = height;
	};

	CocoonJS.Ad.Banner = function(id)
	{
		if (typeof id !== 'number') throw "The given ad ID is not a number.";

		this.id = id;
		var me = this;

		/**
    	* This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is shown.
    	* The callback function does not receive any parameter.
    	* @static
    	* @event
    	*/
		this.onBannerShown = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannershow", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener();
    		}
    	});

    	/**
    	* This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is hidden.
    	* The callback function does not receive any parameter.
    	* @static
    	* @event
    	*/
		this.onBannerHidden = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannerhide", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener();
    		}
    	});

    	/**
    	* This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is ready (cached).
    	* The callback function does not receive any parameter.
    	* @param {number} width The banner width
    	* @param {number} height The banner height
    	* @static
    	* @event
    	*/
		this.onBannerReady = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannerready", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener(args[1], args[2]);
    		}
    	});
	};

	CocoonJS.Ad.Banner.prototype = {

		/**
		* Shows a banner ad if available.
		* @function
		*/
		showBanner : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "showBanner", [this.id], true);
			}
		},

		/**
		* Hides the banner ad if it was being shown.
		* @function
		*/
		hideBanner : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "hideBanner", [this.id], true);
			}
		},

		/**
		* Refreshes the banner.
		* @function
		*/
		refreshBanner : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "refreshBanner", [this.id], true);
			}
		},

		/**
		* Gets the rectangle representing the banner screen position.
		* @function
		* @return {CocoonJS.Ad.Rectangle} rectangle The rectangle representing the banner position and domensions.
		*/
		getRectangle : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "getRectangle", [this.id]);
			}
		},

		/**
		* Sets the rectangle where the banner ad is going to be shown.
		* @function
		* @param {CocoonJS.Ad.Rectangle} rect The rectangle representing the banner position and domensions.
		*/
		setRectangle : function(rect)
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "setRectangle", [this.id, rect],true);
			}
		},

		/**
		* Sets the rectangle where the banner ad is going to be shown.
		* You can use this method if you want to have better control of the banner screen positioning.
		* @function
		* @param {CocoonJS.Ad.BannerLayout} bannerLayout The layout where the bannerwill be placed.
		*/
		setBannerLayout : function(bannerLayout)
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "setBannerLayout", [this.id, bannerLayout],true);
			}
		}
	};

	CocoonJS.Ad.Fullscreen = function(id)
	{
		if (typeof id !== 'number') throw "The given ad ID is not a number.";

		this.id = id;
		var me = this;

		/**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is shown.
	    * The callback function does not receive any parameter.
	    * @static
	    * @event
	    */
		this.onFullScreenShown = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenshow", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});

		/**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is hidden.
	    * The callback function does not receive any parameter.
	    * @static
	    * @event
	    */
    	this.onFullScreenHidden = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenhide", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});

    	/**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is ready (cached).
	    * The callback function does not receive any parameter.
	    * @static
	    * @event
	    */
    	this.onFullScreenReady = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenready", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});
	};

	CocoonJS.Ad.Fullscreen.prototype = {

		/**
		* Shows a full screen ad if available.
		* @function
		* @see CocoonJS.Ad.onFullScreenShown
		* @see CocoonJS.Ad.onFullScreenHidden
		*/
		showFullScreen : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "showFullScreen", [this.id], true);
			}
		},

		/**
		* Refreshes the fullscreen.
		* @function
		*/
		refreshFullScreen : function()
		{
			if (CocoonJS.Ad.nativeExtensionObjectAvailable)
			{
				return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "refreshFullScreen", [this.id], true);
			}
		}
	};

	/**
	* Initialize the service with service level initialization parameters.
	* @function
	* @param {object} An object with the required initialization parameters for the service.
	*/
	CocoonJS.Ad.requestInitialization = function(parameters)
	{
        if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "requestInitialization", arguments, true);
		}
	};

	/**
	* Creates a new banner ad.
	* @function
	* @param {object} An object containing the properties the ad will need for its initialization.
	*/
	CocoonJS.Ad.createBanner = function(parameters)
	{
		if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			var adId = CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "createBanner", [parameters]);
			var banner = new CocoonJS.Ad.Banner(adId);

			return banner;
		}
	};

	/**
	* Releases a banner.
	* @function
	* @param {object} The banner ad object to be released.
	*/
	CocoonJS.Ad.releaseBanner = function(banner)
	{
		if (typeof banner === "undefined") {
            throw "The banner ad object to be released is undefined"
        }

		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "releaseBanner", [banner.id]);
		}
	};

	/**
	* Creates a new fullscreen ad.
	* @function
	* @param {object} An object containing the properties the ad will need for its initialization.
	*/
	CocoonJS.Ad.createFullscreen = function(parameters)
	{
		if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			var adId = CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "createFullscreen", [parameters]);
			var fullscreen = new CocoonJS.Ad.Fullscreen(adId);

			return fullscreen;
		}
	};

	/**
	* Releases a fullscreen ad.
	* @function
	* @param {object} The fullscreen ad object to be released.
	*/
	CocoonJS.Ad.releaseFullscreen = function(fullscreen)
	{
		if (typeof fullscreen === "undefined") {
            throw "The fullscreen ad object to be released is undefined"
        }

		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "releaseFullscreen", [fullscreen.id]);
		}
	};

	/**
	* Shows a banner ad if available.
	* @function
	* @see CocoonJS.Ad.setBannerLayout
	* @see CocoonJS.Ad.onBannerShown
	*/
	CocoonJS.Ad.showBanner = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "showBanner", arguments, true);
		}
	};

	/**
	* Hides the banner ad if it was being shown.
	* @function
	*/
	CocoonJS.Ad.hideBanner = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "hideBanner", arguments, true);
		}
	};

	/**
	* Refreshes the banner.
	* @function
	*/
	CocoonJS.Ad.refreshBanner = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "refreshBanner", arguments, true);
		}
	};

	/**
	* Shows a full screen ad if available.
	* @function
	* @see CocoonJS.Ad.onFullScreenShown
	* @see CocoonJS.Ad.onFullScreenHidden
	*/
	CocoonJS.Ad.showFullScreen = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "showFullScreen", arguments, true);
		}
	};

	/**
	* Refreshes the fullscreen.
	* @function
	*/
	CocoonJS.Ad.refreshFullScreen = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "refreshFullScreen", arguments, true);
		}
	};

	/**
	* Makes a request to preload a banner ad.
	* @function
	*/
	CocoonJS.Ad.preloadBanner = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "preloadBanner", arguments, true);
		}
	};

	/**
	* Makes a request to preload a full screen ad.
	* @function
	*/
	CocoonJS.Ad.preloadFullScreen = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "preloadFullScreen", arguments, true);
		}
	};

	/**
	* Sets the rectangle where the banner ad is going to be shown.
	* @function
	* @param {CocoonJS.Ad.Rectangle} rect The rectangle representing the banner position and domensions.
	*/
	CocoonJS.Ad.setRectangle = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "setRectangle", arguments, true);
		}
	};

	/**
	* Gets the rectangle representing the banner screen position.
	* @function
	* @return {CocoonJS.Ad.Rectangle} rectangle The rectangle representing the banner position and domensions.
	*/
	CocoonJS.Ad.getRectangle = function()
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "getRectangle", arguments);
		}
	};

	/**
	* Sets the rectangle where the banner ad is going to be shown.
	* You can use this method if you want to have better control of the banner screen positioning.
	* @function
	* @param {CocoonJS.Ad.BannerLayout} bannerLayout The layout where the bannerwill be placed.
	*/
	CocoonJS.Ad.setBannerLayout = function(bannerLayout)
	{
		if (CocoonJS.Ad.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_AD", "setBannerLayout", arguments, true);
		}
	};

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is shown.
    * The callback function does not receive any parameter.
    * @static
    * @event
    */
	CocoonJS.Ad.onBannerShown = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannershow");

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is hidden.
    * The callback function does not receive any parameter.
    * @static
    * @event
    */
	CocoonJS.Ad.onBannerHidden = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannerhide"); 

	/**
	* This {@link CocoonJS.EventHandler} object allows listening to events called when a banner is ready (cached).
	* The callback function does not receive any parameter.
	* @param {number} width The banner width
	* @param {number} height The banner height
	* @static
	* @event
	*/
	CocoonJS.Ad.onBannerReady = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onbannerready"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is shown.
    * The callback function does not receive any parameter.
    * @static
    * @event
    */
	CocoonJS.Ad.onFullScreenShown = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenshow"); 

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is hidden.
    * The callback function does not receive any parameter.
    * @static
    * @event
    */
	CocoonJS.Ad.onFullScreenHidden = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenhide");

	/**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a full screen ad is ready (cached).
    * The callback function does not receive any parameter.
    * @static
    * @event
    */
	CocoonJS.Ad.onFullScreenReady = new CocoonJS.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenready"); 

})();