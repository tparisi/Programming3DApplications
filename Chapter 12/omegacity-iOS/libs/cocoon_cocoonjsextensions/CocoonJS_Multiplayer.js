(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

	/**
	* This type represents the access to a native Social extension API. As there can be more than
	* one service of this type, more than one instance can be created.
	* @namespace
	* @constructor
	* @param {string} nativeExtensionName The name of the native ext object extension property name.
	* @param {string} extensionName The name of the CocoonJS object extension property name.
	*/
	CocoonJS.Multiplayer = function(nativeExtensionName, extensionName)
	{
		if (typeof nativeExtensionName !== 'string') throw "The given native extension name '" + nativeExtensionName + "' is not a string.";
		if (typeof extensionName !== 'string') throw "The given extension name '" + nativeExtensionName + "' is not a string.";

		this.nativeExtensionName = nativeExtensionName;
		this.extensionName = extensionName;
	    this.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext[nativeExtensionName] !== 'undefined';
	    return this;
	};


	CocoonJS.Multiplayer.prototype = {

		/**
		* Creates a Match Manager instance
		* @see CocoonJS.Social.onRequestLoginSucceed
		* @function
		* @return
		*/
		createMatchManager : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				var matchManagerID = CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "createMatchManager", arguments);
				return new CocoonJS.Multiplayer.MatchManager(this.nativeExtensionName, this.extensionName, matchManagerID);
			}
			return null;
		}
	};


	/**
	* This type is used to programmatically create matches to other players and to receive match invitations sent by other players.
	* Your game must authenticate the related social service before you can use this.
	* @namespace
	* @constructor
	* @param {string} nativeExtensionName The name of the native ext object extension property name.
	* @param {string} extensionName The name of the CocoonJS object extension property name.
	* @param {number} matchManagerID The match manager ID user for native bridge
	*/
	CocoonJS.Multiplayer.MatchManager = function(nativeExtensionName, extensionName, matchManagerID)
	{
		if (typeof nativeExtensionName !== 'string') throw "The given native extension name '" + nativeExtensionName + "' is not a string.";
		if (typeof extensionName !== 'string') throw "The given extension name '" + nativeExtensionName + "' is not a string.";

		this.nativeExtensionName = nativeExtensionName;
		this.extensionName = extensionName;
	    this.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext[nativeExtensionName] !== 'undefined';
	    this.matchManagerID = matchManagerID;
	    this.currentMatch = null;
	    var me = this;


	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a match has been found. 
	    * The match might be returned before connections have been established between players. At this stage, all the players are in the process of connecting to each other.
	    * Always check the getExpectedPlayerCount value before starting a match. When its value reaches zero, all expected players are connected, and your game can begin the match.
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchFoundListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	    * @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	    * @param {CocoonJS.Multiplayer.Match} match The found match, the game should start
	    */
	    this.onMatchFound = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchFound", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			var matchID = args[1];
	    			me.currentMatch = new CocoonJS.Multiplayer.Match(me.nativeExtensionName, me.extensionName, matchID);
	    			sourceListener(me, me.currentMatch);
	    		}
	    	});

	    //custom listener to store the current match
	    this.onMatchFound.addEventListener(function(matchManager, match) {
	    	matchManager.currentMatch = match;
	    });

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a match has been canceled by the user
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchRequestCanceledListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	   	* @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	    */
	    this.onMatchRequestCanceled = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchRequestCanceled", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			sourceListener(me);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a match creation operation has failed
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchRequestFailedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	   	* @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	   	* @param {string} error The error message
	    */
	    this.onMatchRequestFailed = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchRequestFailed", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}

	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when an invitation has been received from another player
	    * The callback function's documentation is represented by {@link CocoonJS.Social.onInvitationReceived}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	   	* @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	   	* @param {string} error The error message
	    */
	    this.onInvitationReceived = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onInvitationReceived", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}

	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when addPlayersToMatch operation succeedes
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchPlayerAdditionSucceededListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	   	* @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	   	* @param {string} error The error message
	    */
	    this.onMatchPlayerAdditionSucceeded = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchPlayerAdditionSucceeded", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when addPlayersToMatch operation succeedes
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchPlayerAdditionFailedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.MatchManager
	   	* @param {CocoonJS.Multiplayer.MatchManager} match The source match manager
	   	* @param {string} error The error message
	    */
	    this.onMatchPlayerAdditionFailed = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchPlayerAdditionFailed", function(sourceListener, args)
	    	{
	    		if (me.matchManagerID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});


	};

	CocoonJS.Multiplayer.MatchManager.prototype = {

		/**
		* Presents a system View for the matchmaking and creates a new Match
		* @see CocoonJS.Multiplayer.MatchManager.onMatchFound
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestFailed
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestCanceled
		* @function
		* @param  {CocoonJS.Multiplayer.MatchRequest} matchRequest The parameters for the match
		*/
		createMatch : function(matchRequest)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "createMatch", [this.matchManagerID, matchRequest]);
			}
		},

		/**
		* Sends an automatch request to join the authenticated user to a match. It doesn't present a system view while waiting to other players.
		* @see CocoonJS.Multiplayer.MatchManager.onMatchFound
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestFailed
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestCanceled
		* @function
		* @param  {CocoonJS.Multiplayer.MatchRequest} matchRequest The parameters for the match
		*/
		createAutoMatch : function(matchRequest)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "createAutoMatch", [this.matchManagerID, matchRequest]);
			}
		},


		/**
		* Cancels the ongoing automatch request
		* @see CocoonJS.Multiplayer.MatchManager.onMatchFound
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestFailed
		* @see CocoonJS.Multiplayer.MatchManager.onMatchRequestCanceled
		* @function
		*/
		cancelAutoMatch : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "cancelAutoMatch", [this.matchManagerID]);
			}
		},

		/**
		* Automatically adds players to an ongoing match owned by the user.
		* @see CocoonJS.Multiplayer.MatchManager.onMatchPlayerAdditionSucceeded
		* @see CocoonJS.Multiplayer.MatchManager.onMatchPlayerAdditionFailed
		* @function
		* @param  {CocoonJS.Multiplayer.MatchRequest} matchRequest The parameters for the match
		* @param  {CocoonJS.Multiplayer.Match} matchRequest The match where new players will be added
		*/
		addPlayersToMatch : function(matchRequest, match)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "addPlayersToMatch", [this.matchManagerID, matchRequest, match.matchID]);
			}
		},

		/**
		* Gets the playerID attached to the match manager
		* @function
		* @return {string} the playerID attached to the match manager.
		*/
		getPlayerID : function(matchRequest)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getPlayerID", [this.matchManagerID, matchRequest]);
			}

			return "";
		},

		/**
		* Get the current match reference.
		* @function
		* @return {CocoonJS.Multiplayer.Match} the current match reference
		*/
		getMatch : function(matchRequest)
		{
			return this.currentMatch;
		}
	};


	/**
	* This type provides a transmision network between a group of users.
	* The match might be returned before connections have been established between players. At this stage, all the players are in the process of connecting to each other.
	* Always check the getExpectedPlayerCount value before starting a match. When its value reaches zero, all expected players are connected, and your game can begin the match.
	* Do not forget to call the start method of the match when your game is ready to process received messages via onMatchDataReceived listener.
	* @namespace
	* @constructor
	* @param {string} nativeExtensionName The name of the native ext object extension property name.
	* @param {string} extensionName The name of the CocoonJS object extension property name.
	* @param {number} matchID The match ID user for native service bridge.
	*/
	CocoonJS.Multiplayer.Match = function(nativeExtensionName, extensionName, matchID)
	{
		if (typeof nativeExtensionName !== 'string') throw "The given native extension name '" + nativeExtensionName + "' is not a string.";
		if (typeof extensionName !== 'string') throw "The given extension name '" + nativeExtensionName + "' is not a string.";

		this.nativeExtensionName = nativeExtensionName;
		this.extensionName = extensionName;
	    this.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext[nativeExtensionName] !== 'undefined';
	    this.matchID = matchID;
	    var me = this;


	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a match receives data from the network
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchDataReceivedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {string} data The received data
	    * @param {string} playerID The playerID where the data is received from.
	    */
	    this.onMatchDataReceived = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchDataReceived", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a player connection state changes.
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchStateChangedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {string} playerID The player whose state has changed
	    * @param {CocoonJS.Multiplayer.ConnectionState} The new connection state of the player
	    */
	    this.onMatchStateChanged = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchStateChanged", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when a netowrk connection with a player fails
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchConnectionWithPlayerFailedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {string} playerID The player whose state has changed
	    * @param {string} error The error message
	    */
	    this.onMatchConnectionWithPlayerFailed = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchConnectionWithPlayerFailed", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when the match fails
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchFailedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {string} error The error message
	    */
	    this.onMatchFailed = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchFailed", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when the match fails
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchPlayersInfoRequestSuceededListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {array} playersInfo The array of {@link CocoonJS.Multiplayer.PlayerInfo} objects
	    */
	    this.onMatchPlayersInfoRequestSuceeded = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchPlayersInfoRequestSuceeded", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});

	    /**
	    * This {@link CocoonJS.EventHandler} object allows listening to events called when the match fails
	    * The callback function's documentation is represented by {@link CocoonJS.Social.OnMatchPlayersInfoRequestFailedListener}
	    * @event
	    * @static
	    * @memberOf CocoonJS.Multiplayer.Match
	    * @param {CocoonJS.Multiplayer.Match} match The source match.
	    * @param {string} error The error message
	    */
	    this.onMatchPlayersInfoRequestFailed = new CocoonJS.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchPlayersInfoRequestFailed", function(sourceListener, args)
	    	{
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});
	};

	CocoonJS.Multiplayer.Match.prototype = {

		/**
		* Start processing received messages. The user must call this method when the game is ready to process messages. Messages received before being prepared are stored and processed later.
		* @see CocoonJS.Multiplayer.Match.onMatchDataReceived
		* @function
		*/
		start : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "startMatch", [this.matchID]);
			}
		},

		/**
		* Transmits data to all players connected to the match. The match queues the data and transmits it when the network becomes available.
		* @see CocoonJS.Multiplayer.Match.onMatchDataReceived
		* @see CocoonJS.Multiplayer.Match.onMatchStateChanged
		* @see CocoonJS.Multiplayer.Match.onMatchConnectionWithPlayerFailed
		* @see CocoonJS.Multiplayer.Match.onMatchFailed
		* @function
		* @param {string} sendData The data to transmit
		* @param {CocoonJS.Multiplayer.SendDataMode} sendMode The optional {@link CocoonJS.Multiplayer.SendDataMode} value. The default value is RELIABLE.
		* @result {boolean} TRUE if the data was successfully queued for transmission; FALSE if the match was unable to queue the data
		*/
		sendDataToAllPlayers : function(sendData, sendMode)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "sendDataToAllPlayers", [this.matchID, sendData, sendMode]);
			}
		},

		/**
		* Transmits data to a list of connected players. The match queues the data and transmits it when the network becomes available.
		* @see CocoonJS.Multiplayer.Match.onMatchDataReceived
		* @see CocoonJS.Multiplayer.Match.onMatchStateChanged
		* @see CocoonJS.Multiplayer.Match.onMatchConnectionWithPlayerFailed
		* @see CocoonJS.Multiplayer.Match.onMatchFailed
		* @function
		* @param {string} data The data to transmit
		* @param {array} playerIDs An array containing the identifier strings for the list of players who should receive the data
		* @param {CocoonJS.Multiplayer.SendDataMode} sendMode The optional {@link CocoonJS.Multiplayer.SendDataMode} value. The default value is RELIABLE.
		* @result {boolean} TRUE if the data was successfully queued for transmission; FALSE if the match was unable to queue the data
		*/
		sendData : function(data, playerIDs,  sendMode)
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "sendData", [this.matchID, data, playerIDs, sendMode]);
			}
		},

		/**
		* Disconnects the local player from the match and releases the match. Calling disconnect notifies other players that you have left the match.
		* @see CocoonJS.Multiplayer.Match.onMatchDataReceived
		* @see CocoonJS.Multiplayer.Match.onMatchStateChanged
		* @see CocoonJS.Multiplayer.Match.onMatchConnectionWithPlayerFailed
		* @see CocoonJS.Multiplayer.Match.onMatchFailed
		* @function
		*/
		disconnect : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "disconnect", [this.matchID]);
			}
		},

		/**
		* Requests additional information of the current players in the match
		* @see CocoonJS.Multiplayer.Match.onMatchPlayersInfoRequestSuceeded
		* @see CocoonJS.Multiplayer.Match.onMatchPlayersInfoRequestFailed
		* @function
		*/
		requestPlayersInfo : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "requestPlayersInfo", [this.matchID]);
			}
		},

		/**
		* Method to request the remaining players count who have not yet connected to the match.
		* @function
		* @return {number} The remaining number of players who have not yet connected to the match
		*/
		getExpectedPlayerCount : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getExpectedPlayerCount", [this.matchID]);
			}
		},
		/**
		* This method returns an array with all the player identifiers taking part in the match.
		* @return {array} The player identifiers for the players in the match
		*/
		getPlayerIDs : function()
		{
			if (this.nativeExtensionObjectAvailable)
			{
				CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getPlayerIDs", [this.matchID]);
			}
		},

	};

	/**
	* This enum represents the modes to send data
	* @namespace
	*/
	CocoonJS.Multiplayer.SendDataMode = 
	{
		/**
		* The data is sent continuously until it is successfully received by the intended recipients or the connection times out
		*/
	    RELIABLE : 0,

		/**
		* The data is sent once and is not sent again if a transmission error occurs.
		*/
	    UNRELIABLE : 1
	};


	/**
	* This enum represents the connection state of a player
	* @namespace
	*/
	CocoonJS.Multiplayer.ConnectionState = 
	{
		/**
		* The connection is in unknown state.
		*/
	    UNKNOWN : 0,

	    /**
		* The connection is in connected state.
		*/
	    CONNECTED : 1,

	    /**
		* The connection is in disconnected state.
		*/
	    DISCONNECTED : 2
	};

	/**
	* The data structure that represents the information of a player inside a multiplayer match.
	* @namespace
	* @constructor
	* @param {string} The id of the user.
	* @param {string} The name of the user.
	*/
	CocoonJS.Multiplayer.PlayerInfo = function(userID, userName)
	{
		/**
		* The id of the user.
		* @field
		* @type string
		*/
		this.userID = userID;

		/**
		* The name of the user.
		* @field
		* @type string
		*/
		this.userName = userName;
	};

	/**
	* This data structure is used to specify the parameters for a new new multiplayer match.
	* @namespace
	* @constructor
	* @param {number} minPlayers The minimum number of players that may join the match.
	* @param {number} maxPlayers The maximum number of players that may join the match.
	* @param {array}  [playersToInvite] Optional list of player identifers for players to invite to the match.
	* @param {number} [playerGroup] Optional number identifying a subset of players allowed to join the match.
	* @param {number} [playerAttributes] Optional mask that specifies the role that the local player would like to play in the game.
	*/
	CocoonJS.Multiplayer.MatchRequest = function(minPlayers, maxPlayers, playersToInvite, playerGroup, playerAttributes)
	{
		/**
		* The minimum number of players that may join the match.
		* @field
		* @type number
		*/
		this.minPlayers = minPlayers;

		/**
		* The maximum number of players that may join the match.
		* @field
		* @type number
		*/
		this.maxPlayers = maxPlayers;

		/**
		* Optional list of player identifers for players to invite to the match.
		* @field
		* @type Array
		*/
		this.playersToInvite = playersToInvite;

		/**
		* Optional number identifying a subset of players allowed to join the match.
		* @field
		* @type number
		*/
		this.playerGroup = playerGroup;

		/**
		* Optional mask that specifies the role that the local player would like to play in the game.
		* @field
		* @type number
		*/
		this.playerAttributes = playerAttributes;

		return this;
	};

})();