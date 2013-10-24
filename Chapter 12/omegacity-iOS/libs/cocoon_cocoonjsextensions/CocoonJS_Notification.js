(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
    * This namespace represents the CocoonJS Notification extension.
    * @namespace
    */
    CocoonJS.Notification = {};

    CocoonJS.Notification.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.IDTK_SRV_NOTIFICATION !== 'undefined';

	/**
	* The data structure that represents the information of a local notification.
	* @namespace
	* @constructor
	* @param {string} message The notification message.
	* @param {boolean} soundEnabled A flag that indicates if the sound should be enabled for the notification.
	* @param {number} badgeNumber The number that will appear in the badge of the application icon in the home screen.
	* @param {object} userData The JSON data to attached to the notification.
	* @param {string} contentBody The body content to be showed in the expanded notification information.
	* @param {string} contentTitle The title to be showed in the expanded notification information.
	* @param {number} date Time in millisecs from 1970 when the notification will be fired.
	*/
	CocoonJS.Notification.LocalNotification = function(message, soundEnabled, badgeNumber, userData, contentBody, contentTitle, scheduleTime)
	{
		/**
		* The notification message.
		* @field
		* @type string
		*/
		this.message = message;

		/**
		* A flag that indicates if the sound should be enabled for the notification.
		* @field
		* @type boolean
		*/
		this.soundEnabled = soundEnabled;

		/**
		* (iOS only) The number that will appear in the badge of the application icon in the home screen.
		* @field
		* @type number
		*/
		this.badgeNumber = badgeNumber;

		/**
		* The JSON data to attached to the notification.
		* @field
		* @type object
		*/
		this.userData = userData;

		/**
		* (Android only) The body content to be showed in the expanded notification information.
		* @field
		* @type string
		*/
		if (contentBody !== undefined)
			this.contentBody = contentBody;
		else
			this.contentBody = "";

		/**
		* (Android only) The title to be showed in the expanded notification information.
		* @field
		* @type string
		*/
		if (contentTitle !== undefined)
			this.contentTitle = contentTitle;
		else
			this.contentTitle = "";

		/**
		* Time in millisecs from 1970 when the local notification will be fired
		* @field
		* @type number
		*/
		var currentTime = new Date().getTime();
		if (scheduleTime !== undefined){
			this.scheduleTime = scheduleTime;
		}else{
			this.scheduleTime = currentTime;
		}
	};

	/**
	* The data structure that represents the information of a push notification.
	* @namespace
	* @constructor
	* @param {string} message The notification message.
	* @param {boolean} soundEnabled A flag that indicates if the sound should be enabled for the notification.
	* @param {number} badgeNumber The number that will appear in the badge of the application icon in the home screen.
	* @param {object} userData The JSON data to attached to the notification.
	* @param {array} channels An array containing the channels names this notification will be delivered to.
	* @param {number} expirationTime A time in seconds from 1970 when the notification is no longer valid and will not be delivered in case it has not already been delivered.
	* @param {number} expirationTimeInterval An incremental ammount of time in from now when the notification is no longer valid and will not be delivered in case it has not already been delivered.
	*/
	CocoonJS.Notification.PushNotification = function(message, soundEnabled, badgeNumber, userData, channels, expirationTime, expirationTimeInterval)
	{
		/**
		* The notification message.
		* @field
		* @type string
		*/
		this.message = message;

		/**
		* A flag that indicates if the sound should be enabled for the notification.
		* @field
		* @type boolean
		*/
		this.soundEnabled = soundEnabled;

		/**
		* The number that will appear in the badge of the application icon in the home screen.
		* @field
		* @type number
		*/
		this.badgeNumber = badgeNumber;

		/**
		* The JSON data to attached to the notification.
		* @field
		* @type object
		*/
		this.userData = userData

		/**
		* An array containing the channels names this notification will be delivered to.
		* @field
		* @type array
		*/
		this.channels = channels;

		/**
		* A time in seconds from 1970 when the notification is no longer valid and will not be delivered in case it has not already been delivered.
		* @field
		* @type number
		*/
		if (expirationTime !== undefined)
			this.expirationTime = expirationTime;
		else
			this.expirationTime = 0;

		/**
		* An incremental ammount of time in from now when the notification is no longer valid and will not be delivered in case it has not already been delivered.
		* @field
		* @type number
		*/
		if (expirationTimeInterval !== undefined)
			this.expirationTimeInterval = expirationTimeInterval;
		else
			this.expirationTimeInterval = 0;
	};

	/**
	* Start processing received notifications. The user must call this method when the game is ready to process notifications. Notifications received before being prepared are stored and processed later.
	*/
	CocoonJS.Notification.start = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "start", arguments, true);
		}
	};


	/**
	* Register to be able to receive push notifications.
	* The registration process is controlled using the {@link CocoonJS.Notification.onRegisterForPushNotificationsSucceed} and {@link CocoonJS.Notification.onRegisterForPushNotificationsFailed} event handlers.
	* @function
	* @see {CocoonJS.Notification.onRegisterForPushNotificationsSucceed}
	* @see {CocoonJS.Notification.onRegisterForPushNotificationsFailed}
	*/
	CocoonJS.Notification.registerForPushNotifications = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "registerForPushNotifications", arguments, true);
		}
	};

	/**
	* Unregister from receiving push notifications.
	* The unregistration process is controlled using the {@link CocoonJS.Notification.onUnregisterForPushNotificationsSucceed} event handler.
	* @function
	* @see CocoonJS.Notification.onUnregisterForPushNotificationsSucceed
	*/
	CocoonJS.Notification.unregisterForPushNotifications = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "unregisterForPushNotifications", arguments, true);
		}
	};

	/**
	* Cancel the last sent local notification.
	* The last sent local notification will be remove from the notifications bar.
	* @function
	*/
	CocoonJS.Notification.cancelLastSentLocalNotificiation = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "cancelLocalNotification", arguments, true);
		}
	};

	/**
	* Cancel all sent local notifications.
	* All the notifications will ve removed from the notifications bar.
	* @function
	*/
	CocoonJS.Notification.cancelAllLocalNotifications = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "cancelAllLocalNotifications", arguments, true);
		}
	};

	/**
	* Send a local notification.
	* @function
	* @param {CocoonJS.Notification.LocalNotification} localNotification The local notification to be sent.
	*/
	CocoonJS.Notification.sendLocalNotification = function(localNotification)
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "sendLocalNotification", arguments, true);
		}
	};

	/**
	* Subscribe to a channel in order to receive notifications targeted to that channel.
	* @function
	* @param {string} channel The channel id to subscribe to.
	*/
	CocoonJS.Notification.subscribeToChannel = function(channel)
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "subscribe", arguments, true);
		}
	};

	/**
	* Unsubscribe from a channel in order to stop receiving notifications targeted to it.
	* @function
	* @param {string} channel The channel id to unsubscribe from.
	*/
	CocoonJS.Notification.unsubscribeFromChannel = function(channel)
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "unsubscribe", arguments, true);
		}
	};

	/**
	* Send a push notification.
	* @function
	* @param {CocoonJS.Notification.PushNotification} pushNotification The push notification object to be sent.
	* @see CocoonJS.Notification.onPushNotificationDeliverySucceed
	* @see CocoonJS.Notification.onPushNotificationDeliveryFailed
	*/
	CocoonJS.Notification.sendPushNotification = function(pushNotification)
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "sendPushNotification", arguments, true);
		}
	};

	/**
	* (iOS only) Set the badge number for this application.
	* This is useful if you want to modify the badge number set by a notification.
	* @function
	* @param {number} badgeNumber The number of the badge.
	*/
	CocoonJS.Notification.setBadgeNumber = function(badgeNumber)
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "setBadgeNumber", arguments);
		}
	};

	/**
	* (iOS only) Returns the current badge number.
	* @function
	* @returns {number} The badge number.
	*/
	CocoonJS.Notification.getBadgeNumber = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "getBadgeNumber", arguments);
		}
	};

	/**
	* Returns the last received user data from a Local notification.
	* @function
	* @returns {object} The last received user data from a Local notification.
	*/
	CocoonJS.Notification.getLastReceivedLocalNotificationData = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "getLastReceivedLocalNotificationData", arguments);
		}
	};

	/**
	* Returns the last received user data from a Push notification.
	* @function
	* @returns {object} The last received user data from a Push notification.
	*/
	CocoonJS.Notification.getLastReceivedPushNotificationData = function()
	{
		if (CocoonJS.Notification.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_NOTIFICATION", "getLastReceivedPushNotificationData", arguments);
		}
	};

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the registration for push notification succeeds.
    * The callback function does not receive any parameter.
    * @static
    * @event
    * @param {string} token The token (apid or device token) received at registration time.
    * @memberOf CocoonJS.Notification
    */
	CocoonJS.Notification.onRegisterForPushNotificationsSucceed = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceRegistered");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the unregistration for push notifications succeeds.
    * The callback function does not receive any parameter.
    * @static
    * @event
    * @memberOf CocoonJS.Notification
    */
	CocoonJS.Notification.onUnregisterForPushNotificationsSucceed = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceUnregistered");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the registration for push notifications fails.
    * The callback function receives a parameter with error information.
    * @static
    * @event
    * @param {string} msg The error message.
    */
	CocoonJS.Notification.onRegisterForPushNotificationsFailed = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceFailedToRegister");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a push notification is received.
    * The callback function receives a parameter with the userData of the received notification.
    * @static
    * @event
    * @param {object} userData An object with the notification userData information.
    */
	CocoonJS.Notification.onPushNotificationReceived = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationReceived");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a local notification is received.
    * The callback function receives a parameter with the userData of the received notification.
    * @static
    * @event
    * @param {object} userData An object with the notification userData information.
    */
	CocoonJS.Notification.onLocalNotificationReceived = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "localNotificationReceived");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when a notification is successfully delivered.
    * The callback function receives a parameter with the notificationId of the delivered notification.
    * @static
    * @event
    * @param {string} userData A string with the notification userData information.
    */
	CocoonJS.Notification.onPushNotificationDeliverySucceed = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationSuccessfullyDelivered");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the delivery of push a notification fails.
    * The callback function receives a parameter with error information.
    * @static
    * @event
    * @param {string} msg The error message.
    */
	CocoonJS.Notification.onPushNotificationDeliveryFailed = new CocoonJS.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationDeliveryError");

})();