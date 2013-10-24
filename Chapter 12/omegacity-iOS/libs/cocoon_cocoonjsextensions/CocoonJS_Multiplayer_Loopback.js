(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.Multiplayer === 'undefined' || window.CocoonJS === null) throw("The CocoonJS.Multiplayer object must exist and be valid before creating a Game Center extension object.");

	/**
	* This instance represents the extension object to access Loopback Multiplayer Service related native functionalities.
	* @see CocoonJS.Multiplayer
	*/
	CocoonJS.Multiplayer.Loopback = new CocoonJS.Multiplayer("IDTK_SRV_MULTIPLAYER_LOOPBACK", "Multiplayer.Loopback");


	/*
	* Inject a JavaScript loopback implementation if the native service is missing
	*/
	if (!CocoonJS.Multiplayer.Loopback.nativeExtensionObjectAvailable)
	{

		var loopbackService = CocoonJS.Multiplayer.Loopback;
		loopbackService.matchManagers = [];
		loopbackService.matchRequestPendingMatchManagers = [];
		loopbackService.matchManagerIndexCounter = 0;
		loopbackService.matchIndexCounter = 0;

		loopbackService.registerMatchRequestPendingMatchManager = function(manager, request) {

			//checks if the match manager already added to the pending list
			var exists = false;
			for (var i = 0; i< this.matchRequestPendingMatchManagers.length; ++i) {
				if (this.matchRequestPendingMatchManagers[i] === manager) {
					exists = true; break;
				}
			}
			if (!exists) this.matchRequestPendingMatchManagers.push(manager);

			//Create the match is all required players are ready
			//TODO: check more conditions (playerGroup, playerAttributes, filters) to complete a match
			if (this.matchRequestPendingMatchManagers.length >= request.minPlayers) {
				var managers = this.matchRequestPendingMatchManagers;
				var playerIDs = [];
				//create playerIDs array
				for (var i = 0; i< managers.length; ++i) {
					playerIDs.push(managers[i].getPlayerID());
				}

				//notify the found match to each manager 
				for (var i = 0; i< managers.length; ++i) {
					this.matchIndexCounter++;
					var match = new CocoonJS.Multiplayer.Match(this.nativeExtensionName, this.extensionName, this.matchIndexCounter);
					match.playerIDs = playerIDs.slice();
					match.manager = managers[i];
					prepareLoopbackMatch(match);
					managers[i].currentMatch = match;
					managers[i].onMatchFound.notifyEventListeners(managers[i],match);
				}

				//clear pending list
				loopbackService.matchRequestPendingMatchManagers = [];
			}

		}


		CocoonJS.Multiplayer.Loopback.createMatchManager = function()
		{
			this.matchManagerIndexCounter++;
			var manager = new CocoonJS.Multiplayer.MatchManager(loopbackService.nativeExtensionName, loopbackService.nativeExtensionName, this.matchManagerIndexCounter);
			this.matchManagers.push(manager);
			prepareLoopbackMatchManager(manager);
			return manager;
		}

		function prepareLoopbackMatchManager(manager)
		{
			manager.createMatch = function(request)
			{
				loopbackService.registerMatchRequestPendingMatchManager(this, request);
			};

			manager.createAutoMatch = function(request)
			{
				this.createMatch(request);
			};

			manager.cancelAutoMatch = function()
			{

			};

			manager.getPlayerID = function()
			{
				return this.matchManagerID;
			};

			manager.onMatchFound = new CocoonJS.EventHandler(manager.nativeExtensionName, manager.extensionName, "onMatchFound");
	    	
		}

		function prepareLoopbackMatch(match)
		{
			match.started = false;
			match.pendingData = [];

			match.sendDataToAllPlayers = function(data, sendMode)
			{
				this.sendData(data, this.playerIDs, sendMode);
			}

			match.sendData = function(data, players, sendMode)
			{
				var m = this;
				setTimeout(function()
				{
					var managers = loopbackService.matchManagers;
					for (var i = 0; i< managers.length; ++i) {
						var exists = false;
						for (var j = 0; j < players.length; ++j) {
							if (players[j] === managers[i].getPlayerID()) {
								exists = true; break;
							}
						}
						if (exists) {
							managers[i].getMatch().notifyDataReceived(data,m.manager.getPlayerID());
						}
					}

				},0);
			}

			match.notifyDataReceived = function(data, fromPlayer) {
				if (!this.started) {
					this.pendingData.push({sendData:data, player:fromPlayer});
				}
				else {
					this.onMatchDataReceived.notifyEventListeners(this.matchID,data,fromPlayer);
				}
			}

			match.start = function()
			{
				var me = this;
				setTimeout(function()
				{
					me.started = true;
					for (var i = 0; i < me.pendingData.length; ++i) {
						me.onMatchDataReceived.notifyEventListeners(me.matchID,me.pendingData[i].sendData, me.pendingData[i].player);
					}

				},0);

			}

			match.disconnect = function()
			{

			}

			match.requestPlayersInfo = function()
			{
				var me = this;
				setTimeout(function() {

					var playersInfo = [];
					for (var i = 0; i < me.playerIDs.length; ++i) {
						playersInfo[i] = {userID: me.playerIDs[i], userName: "Player" + me.playerIDs[i]};
					};
					me.onMatchPlayersInfoRequestSuceeded.notifyEventListeners(me.matchID, playersInfo);
				},1);
			}

			match.getPlayerIDs = function()
			{
				return this.playerIDs;
			}

			match.getExpectedPlayerCount = function() 
			{
				return 0;
			}

		};

	};

})();